import { useState } from 'react';

export default function AdicionarProduto() {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    novaCategoria: false,
    novaCategoriaTexto: '',
    imagem: '',
    preco: '',
    descricao: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleNovaCategoria = () => {
    setFormData(prev => ({
      ...prev,
      novaCategoria: !prev.novaCategoria,
      categoria: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosProduto = {
      nome: formData.nome,
      categoria: formData.novaCategoria ? formData.novaCategoriaTexto : formData.categoria,
      imagem: formData.imagem,
      preco: parseFloat(formData.preco),
      descricao: formData.descricao
    };
    console.log(dadosProduto);
    // Chamada à API para cadastrar o produto
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full sm:max-w-xl">

        {/* Header com logo e título */}
        <div className="mb-6">
          <img
            src="logo.png"
            alt="Logo da Marca"
            className="h-12 mb-2 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#3681B6' }}>
            Adicionar Produto
          </h1>
        </div>

        <form className="space-y-4 text-black" onSubmit={handleSubmit}>
          {/* Nome do Produto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Arroz branco"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3681B6] text-black placeholder:text-gray-400"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            {formData.novaCategoria ? (
              <input
                type="text"
                name="novaCategoriaTexto"
                value={formData.novaCategoriaTexto}
                onChange={handleChange}
                placeholder="Nova categoria"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3681B6]"
                required
              />
            ) : (
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3681B6]"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="alimentos">Alimentos</option>
                <option value="higiene">Higiene</option>
                <option value="roupas">Roupas</option>
              </select>
            )}

            <button
              type="button"
              className="text-sm mt-1 hover:underline"
              style={{ color: '#3681B6' }}
              onClick={toggleNovaCategoria}
            >
              {formData.novaCategoria ? 'Selecionar categoria existente' : 'Adicionar nova categoria'}
            </button>
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="imagemUpload"
                className="cursor-pointer bg-[#3681B6] text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
              >
                Escolher imagem
              </label>
              <span className="text-sm text-gray-500">
                {formData.imagem ? "Imagem selecionada" : "Nenhum arquivo escolhido"}
              </span>
            </div>

            <input
              id="imagemUpload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData(prev => ({
                      ...prev,
                      imagem: reader.result
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />

            {formData.imagem && (
              <div className="mt-4 relative">
                <img
                  src={formData.imagem}
                  alt="Preview da Imagem"
                  className="max-h-48 rounded-xl object-contain border border-gray-300 w-full"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imagem: '' }))}
                  className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-100 transition cursor-pointer"
                  title="Remover imagem"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="Ex: 49.90"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3681B6]"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva o produto..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3681B6]"
              rows={4}
              required
            ></textarea>
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full p-3 rounded-xl text-white font-medium hover:opacity-90 transition cursor-pointer"
            style={{ backgroundColor: '#3681B6' }}
          >
            Cadastrar Produto
          </button>
        </form>
      </div>
    </div>
  );
}
