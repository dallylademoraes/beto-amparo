// frontEnd/components/ProdutoCard.js
import { useState } from "react";
import Image from "next/image";

export default function ProdutoCard({
  produto,
  quantidade = 1,
  onAdicionar, // Essa prop recebe a função handleAdicionar do ClienteHome
  onAumentar,
  onDiminuir,
  getImagemProduto,
  slug
}) {
  const [imageSrc, setImageSrc] = useState(getImagemProduto(produto.image));

  const handleCardClick = () => {
    window.location.href = `produto/${slug}/${produto.id}`;
  };

  const handleAdicionarClick = (event) => {
    event.stopPropagation(); 
    onAdicionar(produto); 
  };

  const handleQuantidadeClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:scale-105 hover:shadow-lg transition duration-300 w-full sm:max-w-md lg:max-w-lg"
      onClick={handleCardClick} 
    >
        <div className="relative w-20 aspect-square">
            <Image
                src={imageSrc}
                alt={produto.nome}
                fill
                className="rounded-lg object-cover"
                unoptimized
                onError={() => setImageSrc("/frontEnd/public/fallback.png")}
            />
        </div>

      <div className="flex-1 mx-4">
        <h2 className="text-base font-semibold text-gray-800 truncate">{produto.nome}</h2>
        <p className="text-sm text-gray-500 line-clamp-2">{produto.descricao}</p>
        <p className="text-green-600 font-bold mt-1 whitespace-nowrap">
            R$ {parseFloat(produto.preco).toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex border rounded-md overflow-hidden">
            <button
                onClick={(event) => { onDiminuir(event); handleQuantidadeClick(event); }}
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border-r text-sm sm:text-base hover:bg-gray-100"
            >
                −
            </button>
            <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-700">
                {quantidade}
            </span>
            <button
                onClick={(event) => { onAumentar(event); handleQuantidadeClick(event); }}
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border-l text-sm sm:text-base hover:bg-gray-100"
            >
                +
            </button>
        </div>

        <button
            onClick={handleAdicionarClick} 
            className="ml-2 sm:ml-3 px-2 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2"        >
            <Image src="/icons/cart_icon.svg" alt="Carrinho" width={14} height={14} />
            Adicionar
        </button>
      </div>
    </div>
  );
}