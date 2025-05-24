// C:\Users\Dallyla\OneDrive\Área de Trabalho\beto-amparo\beto-amparo\backend\routes\carrinhoRoutes.js
import express from 'express';
import supabase from '../config/SupaBase.js'; // Certifique-se de que o caminho está correto
const router = express.Router();

// Middleware para buscar o ID da loja a partir do slug
async function getLojaIdBySlug(req, res, next) {
    const { slug } = req.params;
    console.log("DEBUG: Middleware 'getLojaIdBySlug' acionado.");
    console.log("DEBUG: Slug recebido:", slug);

    if (!slug) {
        console.log("DEBUG: Slug não fornecido.");
        return res.status(400).json({ erro: 'Slug da loja é obrigatório.' });
    }
    try {
        // Consulta a tabela 'empresas' para obter o ID da loja pelo slug
        const { data: loja, error } = await supabase
            .from('loja') // AGORA O NOME DA TABELA ESTÁ CORRETO: 'empresas'
            .select('id')
            .eq('slug_loja', slug)
            .single(); // Espera exatamente um resultado

        if (error) {
            console.error('DEBUG: Erro do Supabase ao buscar empresa pelo slug:', error);
            // PGRST116 é o código de erro do PostgREST para "no rows found"
            if (error.code === 'PGRST116') {
                return res.status(404).json({ erro: 'Loja não encontrada.' });
            }
            return res.status(500).json({ erro: 'Erro no banco de dados ao buscar loja.' });
        }

        if (!loja) { // Caso não encontre a loja, embora o .single() já trataria a maioria desses casos
            console.log("DEBUG: Nenhuma loja encontrada com o slug:", slug);
            return res.status(404).json({ erro: 'Loja não encontrada.' });
        }

        req.lojaId = loja.id; // Armazena o ID da loja no objeto de requisição
        console.log("DEBUG: Loja encontrada! ID:", req.lojaId);
        next(); // Continua para a próxima função da rota (POST, GET, DELETE)
    } catch (err) {
        console.error('DEBUG: Erro inesperado no middleware getLojaIdBySlug:', err);
        res.status(500).json({ erro: 'Erro interno no servidor ao buscar loja.' });
    }
}

// Rota para adicionar produto ao carrinho
router.post('/:slug/carrinho', getLojaIdBySlug, async (req, res) => {
    const { produtoId, quantidade } = req.body;
    const lojaId = req.lojaId; // Obtemos o lojaId do objeto req, que foi adicionado pelo middleware
   

    if (!produtoId || !quantidade || !lojaId) {
        return res.status(400).json({ erro: 'Produto ID, quantidade e ID da loja são obrigatórios.' });
    }

    try {
        console.log(`Recebido para loja ${lojaId}: produtoId=${produtoId}, quantidade=${quantidade}`);

        // Verificar se o produto já existe no carrinho para a MESMA LOJA
        const { data: existingItem, error: fetchError } = await supabase
            .from('carrinho')
            .select('*')
            .eq('produto_id', produtoId)
            .eq('loja_id', lojaId) // <--- FILTRANDO PELA NOVA COLUNA 'loja_id'
            .single();

        let data;
        let updateError;

        if (existingItem) {
            // Se o item já existe para esta loja, atualiza a quantidade
            const newQuantity = existingItem.quantidade + quantidade;
            ({ data, error: updateError } = await supabase
                .from('carrinho')
                .update({ quantidade: newQuantity })
                .eq('id', existingItem.id)); // Atualiza o item existente
            if (updateError) throw updateError;
            res.status(200).json({ mensagem: 'Quantidade do produto atualizada no carrinho.' });
        } else {
            // Se o item não existe, insere um novo
            ({ data, error: updateError } = await supabase
                .from('carrinho')
                .insert([
                    {
                        produto_id: produtoId,
                        quantidade,
                        loja_id: lojaId // <--- SALVANDO O ID DA LOJA NA NOVA COLUNA
                    },
                ]));
            if (updateError) throw updateError;
            res.status(201).json({ mensagem: 'Produto adicionado ao carrinho com sucesso.' });
        }

    } catch (err) {
        console.error('Erro no Supabase ao adicionar/atualizar carrinho:', err);
        if (err.code === '23503') { // Foreign key constraint violation (ex: produtoId ou lojaId inválido)
            return res.status(404).json({ erro: 'Produto ou Loja associados não encontrados.' });
        }
        res.status(500).json({ erro: 'Erro interno ao adicionar/atualizar ao carrinho.' });
    }
});

// Rota para buscar os itens do carrinho para uma loja específica
router.get('/:slug/carrinho', getLojaIdBySlug, async (req, res) => {
    const lojaId = req.lojaId; // Obtemos o lojaId do objeto req

    try {
        const { data, error } = await supabase
            .from('carrinho')
            .select(`
                id,
                quantidade,
                produto:produto_id (
                    id,
                    nome,
                    preco,
                    image
                )
            `)
            .eq('loja_id', lojaId); // <--- FILTRANDO PELA NOVA COLUNA 'loja_id'

        if (error) {
            console.error('Erro ao buscar carrinho:', error);
            return res.status(500).json({ erro: 'Erro ao buscar o carrinho.' });
        }

        if (!data || data.length === 0) {
            return res.status(200).json([]); // Retorna array vazio se não houver itens
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Erro inesperado ao buscar carrinho:', err);
        res.status(500).json({ erro: 'Erro interno ao buscar o carrinho.' });
    }
});

// Rota para remover item do carrinho
router.delete('/:slug/carrinho/:id', getLojaIdBySlug, async (req, res) => {
    const { id } = req.params; // ID do item do carrinho (não do produto)
    const lojaId = req.lojaId; // Obtemos o lojaId do objeto req

    if (!id || !lojaId) {
        return res.status(400).json({ erro: 'ID do item do carrinho e ID da loja são obrigatórios.' });
    }

    try {
        console.log(`Removendo item com id ${id} para loja ${lojaId}`);

        const { data, error } = await supabase
            .from('carrinho')
            .delete()
            .eq('id', id)
            .eq('loja_id', lojaId); // <--- GARANTINDO QUE REMOVE APENAS DA LOJA CERTA

        if (error) {
            console.error('Erro ao remover item do carrinho:', error);
            return res.status(500).json({ erro: 'Erro ao remover item do carrinho.' });
        }

        // Supabase delete retorna um array vazio se nada foi deletado
        if (!data || data.length === 0) {
            return res.status(404).json({ mensagem: 'Item não encontrado ou não pertence a esta loja no carrinho.' });
        }

        console.log('Item removido:', data);
        res.status(200).json({ mensagem: 'Item removido do carrinho com sucesso.' });
    } catch (err) {
        console.error('Erro inesperado ao remover item do carrinho:', err);
        res.status(500).json({ erro: 'Erro interno ao remover item do carrinho.' });
    }
});

export default router;