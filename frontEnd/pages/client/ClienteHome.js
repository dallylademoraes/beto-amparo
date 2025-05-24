import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import ProdutoCard from "@/components/ProdutoCard";
import { useRouter } from 'next/router';

export default function ClienteHome() {
  const router = useRouter();
  const { site } = router.query 

  const [lojaId, setLojaId] = useState(null);
  const [nomeFantasia, setNomeFantasia] = useState("Carregando...");

  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Função para remover acentos
  const removeAccents = (str) => {
    return str
      .normalize("NFD") // Decompõe caracteres acentuados (ex.: "á" vira "a" + acento)
      .replace(/[\u0300-\u036f]/g, ""); // Remove os diacríticos (acentos)
  };

  // Filtragem dos produtos com remoção de acentos
  const produtosFiltrados = produtos.filter((produto) =>
    removeAccents(produto.nome.toLowerCase()).includes(
      removeAccents(searchTerm.toLowerCase())
    )
  );

  const [quantidades, setQuantidades] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [corMensagem, setCorMensagem] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [fotoLoja, setFotoLoja] = useState(null);
  const [corPrimaria, setCorPrimaria] = useState("#3B82F6"); // Valor padrão

  useEffect(() => {
    
    if (!site) return;
  
    async function fetchEmpresa() {
      try {
        const url = `${process.env.NEXT_PUBLIC_EMPRESA_API}/loja/slug/${site}`;
        const response = await fetch(url);
  
        if (!response.ok) {
          // Tenta obter corpo do erro
          let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage += ` - ${errorData.message}`;
            }
          } catch (jsonError) {
            // Não conseguiu parsear o JSON do erro
          }
  
          console.error("Erro na resposta da API:", errorMessage);
          setNomeEmpresa("Erro ao carregar");
          return;
        }
  
        const data = await response.json();
        console.log("Dados da loja da API:", data); // Depuração
        setLojaId(data.id);
        setNomeFantasia(data.nome_fantasia || "Sem nome fantasia");
        setFotoLoja(data.foto_loja || null);
        setCorPrimaria(data.cor_primaria || "#3B82F6"); // Atualiza com a cor da API
      } catch (error) {
        console.error("Erro na requisição ao buscar empresa:", error.message || error);
        setNomeEmpresa("Erro ao carregar");
      }
    }
  
    fetchEmpresa();
  }, [site]);
  
 
  useEffect(() => {
    if (!lojaId) return;

    async function fetchProdutos() {
      try {
        const url = `${process.env.NEXT_PUBLIC_EMPRESA_API}/produtos/loja/${lojaId}`;
        const response = await fetch(url);
        
        if (!response.ok) console.error("Erro na resposta da API:", response.statusText);
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error.message);
      }
    }

    fetchProdutos();
  }, [lojaId]);

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Compartilhe este link",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      const url = window.location.href;
      const text = encodeURIComponent("Confira esse conteúdo:");
      const shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      window.open(shareUrl, "_blank");
    }
  };

const getImagemProduto = (caminhoImagem) => {
  if (!caminhoImagem) return null;
  if (caminhoImagem.startsWith('http')) return caminhoImagem;
  const baseUrl = 'https://cufzswdymzevdeonjgan.supabase.co/storage/v1/object/public';
  return `${baseUrl}/imagens/clientes/${encodeURIComponent(caminhoImagem)}`;
};
  

  useEffect(() => {
    if (!showSearch) {
      setSearchTerm("");
    }
  }, [showSearch]);

  const handleAumentar = (id) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const handleDiminuir = (id) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const handleAdicionar = async (produto) => {
    try {
      const qtd = quantidades[produto.id] || 1;
      console.log(`Adicionando ${qtd}x ${produto.nome} ao carrinho...`);
  
      // CORREÇÃO AQUI: Adicione '/loja/' ao caminho da API
      const url = `${process.env.NEXT_PUBLIC_EMPRESA_API}/loja/${site}/carrinho`; 
      console.log("Adicionando produto em:", url); // Para depuração
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produtoId: produto.id,
          quantidade: qtd,
          lojaId: lojaId // Mantenha isso se o backend espera
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Erro no backend:', data.erro);
        throw new Error(data.erro || 'Erro desconhecido');
      }
  
      console.log(`Produto ${produto.nome} adicionado com sucesso.`);
      setMensagem('Produto adicionado ao carrinho!');
      setCorMensagem('text-green-600');
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      setMensagem(`Erro: ${err.message}`);
      setCorMensagem('text-red-600');
    }
  
    setTimeout(() => setMensagem(''), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header
        className="text-white px-4 py-3 flex items-center justify-between shadow relative"
        style={{ backgroundColor: corPrimaria }}
      >
        {!showSearch && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={fotoLoja ? getImagemProduto(fotoLoja) : "/fallback.png"}
                alt="Logo da Loja"
                width={50}
                height={50}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-lg font-bold">{nomeFantasia}</h1>
          </div>
        )}
        {showSearch && (
          <div className="flex items-center bg-white rounded-full px-3 py-1 w-full max-w-xl mx-auto shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-2"
              fill={corPrimaria}
              viewBox="0 0 24 24"
              stroke="none"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="O que você quer comprar hoje?"
              className="flex-1 text-sm text-gray-800 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-red-600">
              ✕
            </button>
          </div>
        )}
        {!showSearch && (
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setShowSearch(true)}
              className="flex flex-col items-center cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill={corPrimaria}
                  viewBox="0 0 24 24"
                  stroke="none"
                >
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </div>
              <span className="text-[10px] mt-1">Buscar</span>
            </button>
            <button
              onClick={handleShareClick}
              className="flex flex-col items-center cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill={corPrimaria}
                  viewBox="0 0 24 24"
                  stroke="none"
                >
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                </svg>
              </div>
              <span className="text-[10px] mt-1">Compartilhar</span>
            </button>
          </div>
        )}
      </header>

      <div className="bg-blue-50 border border-blue-200 rounded-md mx-4 my-4 mt-3 px-3 py-2 flex items-center gap-2 text-sm text-blue-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Atendimento: <strong>Segunda a Sexta, das 08h às 18h</strong>
      </div>

      <div className="flex-1 px-4 overflow-y-auto pb-24">
        {mensagem && (
          <div className={`text-center mb-4 font-medium ${corMensagem}`}>
            {mensagem}
          </div>
        )}
        {produtosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {produtosFiltrados.map((produto) => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                quantidade={quantidades[produto.id] || 1}
                onAumentar={() => handleAumentar(produto.id)}
                onDiminuir={() => handleDiminuir(produto.id)}
                onAdicionar={() => handleAdicionar(produto)}
                getImagemProduto={getImagemProduto}
                slug={site}

              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-10 text-lg">
            Nenhum produto disponível no momento.
          </div>
        )}
      </div>
      <NavBar site={site} corPrimaria={corPrimaria} />
    </div>
  );
  
} 