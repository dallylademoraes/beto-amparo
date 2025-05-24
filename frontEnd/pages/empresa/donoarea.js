import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import FloatingNotificationsTop from '@/components/notification';
export default function OwnerDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = true;
    if (!isAuthenticated) router.push('/login');
  }, [router]);

  return (
    
    <div className="min-h-screen flex flex-col md:flex-row">
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
            <div
              onClick={() => router.push('/empresa/donoarea')}
              className="flex flex-col items-center gap-2 p-2 cursor-pointer text-center"
            >
              <Image src="/icons/store_white.svg" alt="Área do dono" width={40} height={40} />
              <span className="font-semibold text-lg">Área do dono</span>
            </div>

            <NavItem icon="/icons/dashboard_white.svg" label="Dashboard" path="/dashboard" />
            <NavItem icon="/icons/add_white.svg" label="Adicionar Produtos" path="/adicionar-produto" />
            <NavItem icon="/icons/notification_white.svg" label="Notificações" path="/owner/notificacoes" />
            <NavItem icon="/icons/paint_white.svg" label="Personalizar Loja" path="/personalizacao-loja" />
            <NavItem icon="/icons/help_white.svg" label="Suporte" path="/suporte" />
          </div>
        </div>
        <button className="bg-orange-400 hover:bg-orange-500 p-2 rounded text-white mt-4">SAIR</button>
      </aside>

      <main className="flex-1 bg-gray-100 p-6 md:p-8">
      <FloatingNotificationsTop/>
        <h1 className="text-2xl font-bold text-gray-600 mb-6 text-center">Bem-vindo (a) de volta, Fulano!</h1>
        <div className="mt-4 w-full max-w-3xl mx-auto mb-6">
          <label className="block text-gray-800 text-sm mb-1 font-bold">Link da sua loja:</label>
          <div className="flex items-center bg-white rounded shadow p-2">
            <input
              type="text"
              readOnly
              value="http://localhost:3000/slug"
              className="flex-1 outline-none bg-transparent text-sm text-gray-600"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText("http://localhost:3000/slug");
              }}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
            >
              Copiar
            </button>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 w-full max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="col-span-2 md:col-span-4">
            <h2 className="text-lg font-semibold text-gray-600 mb-1">Resumo geral:</h2>
          </div>
          <InfoCard value="24" sub="produtos ativos" />
          <InfoCard value="3" sub="novos pedidos" />
          <InfoCard value="53" sub="pedidos finalizados" />
          <InfoCard value="2" sub="notificações" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <ActionCard icon="/icons/add2.svg" label="Adicionar Produtos" path="/adicionar-produto" />
            <ActionCard icon="/icons/notification.svg" label="Notificações" path="/notificacoes" />
            <ActionCard icon="/icons/paint_gray.svg" label="Personalizar Loja" path="/personalizacao-loja" />
            <ActionCard icon="/icons/store_gray.svg" label="Ver Loja" path="/loja" />
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col gap-4">
            <div className="text-sm font-semibold text-gray-600 border-b pb-1">Promoções</div>
            <ActionCard icon="/icons/sale.svg" label="Adicionar Promoção" noBg />
            <ActionCard icon="/icons/check.svg" label="Promoções Ativas" noBg />
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, path }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(path)}
      className="flex items-center gap-2 p-2 hover:bg-blue-700 cursor-pointer rounded"
    >
      <Image src={icon} alt={label} width={20} height={20} />
      <span>{label}</span>
    </div>
  );
}

function InfoCard({ value, sub }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow text-center">
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{sub}</div>
    </div>
  );
}

function ActionCard({ icon, label, path, noBg = false }) {
  const router = useRouter();
  const classes = `
    ${noBg ? 'bg-white' : 'bg-white'}
    p-4 rounded shadow flex items-center gap-4 hover:bg-gray-100 cursor-pointer text-gray-500
  `;
  return (
    <div onClick={() => path && router.push(path)} className={classes}>
      <Image src={icon} alt={label} width={24} height={24} />
      <span className="text-lg font-semibold">{label}</span>
    </div>
  );
}
