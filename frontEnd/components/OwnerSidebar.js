// components/OwnerSidebar.js
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Clock } from "lucide-react"

// Helper component para os itens de navegação
// Adiciona uma prop 'onClick' para lidar com ações como logout
function NavItem({ icon, label, path, currentSlug, onClick }) {
  const router = useRouter();
  const fullPath = currentSlug ? `/empresa/${currentSlug}${path}` : path;

  // Renderiza um botão se houver onClick, senão um Link
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 p-2 w-full text-left hover:bg-blue-700 cursor-pointer rounded"
      >
        <Image src={icon} alt={label} width={20} height={20} className="flex-shrink-0" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link
      href={fullPath}
      className="flex items-center gap-2 p-2 hover:bg-blue-700 cursor-pointer rounded"
    >
      <Image src={icon} alt={label} width={20} height={20} className="flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export default function OwnerSidebar({ children, slug }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Função de logout integrada diretamente na sidebar
  const handleLogout = async () => {
    try {
      console.log('OwnerSidebar: Tentando fazer logout...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_EMPRESA_API}/logout`, {
        method: 'POST', // Use POST para logout
        credentials: 'include', // Essencial para enviar o cookie
      });

      if (response.ok) {
        console.log('OwnerSidebar: Logout bem-sucedido. Redirecionando para a página inicial.');
        // Redireciona para a página de login ou home após o logout
        router.push('/empresa/LoginEmpresa'); // Redirecione para a página de login da empresa
      } else {
        const errorData = await response.json();
        console.error('OwnerSidebar: Falha no logout:', errorData.mensagem || 'Erro desconhecido');
        alert(`Erro ao fazer logout: ${errorData.mensagem || 'Tente novamente.'}`);
      }
    } catch (error) {
      console.error('OwnerSidebar: Erro de rede ao fazer logout:', error);
      alert('Erro de conexão. Verifique sua rede e tente novamente.');
    }
  };

  const ownerAreaPath = '/empresa/donoarea';

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Header Mobile */}
      <div className="bg-[#3681B6] text-white flex items-center justify-between p-4 md:hidden">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="font-bold text-lg">BETO Amparo</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar Principal */}
      <aside className={`
        fixed md:static z-40 bg-[#3681B6] text-white w-64 min-h-screen p-4 flex flex-col justify-between
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div>
          <div className="flex items-center mb-4">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="mr-2" />
            <div className="leading-tight text-lg">
              <span className="font-bold">BETO</span>{' '}
              <span className="font-normal">Amparo</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* Link para a área do dono/dashboard principal */}
            <Link
              href={ownerAreaPath}
              className="flex flex-col items-center gap-2 p-2 cursor-pointer text-center"
            >
              <Image src="/icons/store_white.svg" alt="Área do dono" width={40} height={40} />
              <span className="font-semibold text-lg">Área do dono</span>
            </Link>

            {/* Itens de navegação */}
            <NavItem icon="/icons/dashboard_white.svg" label="Dashboard" path="/dashboard" currentSlug={slug} />
            <NavItem icon="/icons/add_white.svg" label="Meus Produtos" path="/produtos" currentSlug={slug} />
            <NavItem icon="/icons/paint_white.svg" label="Personalizar Loja" path="/personalizacao-loja" currentSlug={slug} />
            <NavItem icon="/icons/help_white.svg" label="Suporte" path="/suporte" currentSlug={slug} />
            <NavItem icon="/icons/clock_white.svg"  label="Horarios" path="/empresa/horarioEmpresa"  />
          </div>
        </div>
        
        {/* Botão SAIR no final da sidebar */}
        <button
          onClick={handleLogout} // Chama a função de logout
          className="bg-orange-400 hover:bg-orange-500 p-2 rounded text-white mt-4 w-full"
        >
          SAIR
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 bg-gray-100 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}