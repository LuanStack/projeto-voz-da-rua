import { Menu, Plus, Search, ShieldAlert, X } from 'lucide-react';

const TAB_TITLES = {
  map: {
    title: 'Mapa Colaborativo de Belém',
    subtitle: 'Consulte problemas nas vias públicas ou selecione um marcador para confirmar.',
  },
  list: {
    title: 'Lista de Ocorrências',
    subtitle: 'Visualize, ordene e valide os relatos comunitários registrados em Belém/PA.',
  },
  admin: {
    title: 'Painel Administrativo Demonstrativo',
    subtitle: 'Moderação, alteração de status e indicadores agregados (sem autenticação real).',
  },
  about: {
    title: 'Sobre o Piloto & Segurança',
    subtitle: 'Diretrizes de uso colaborativo, privacidade e transparência do Voz da Rua.',
  },
};

export function Header({
  activeTab,
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  onOpenForm,
}) {
  const headerInfo = TAB_TITLES[activeTab] || TAB_TITLES.map;

  return (
    <header className="sticky top-0 z-[1050] border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#102B46] shadow-xs transition hover:bg-sky-50 lg:hidden"
            aria-label="Abrir menu lateral"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-[#102B46] sm:text-xl">
                {headerInfo.title}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-800 ring-1 ring-sky-200">
                <ShieldAlert className="h-3 w-3 text-sky-600" />
                Relatos comunitários (Demo)
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{headerInfo.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {(activeTab === 'map' || activeTab === 'list' || activeTab === 'admin') && (
            <div className="relative flex-1 sm:w-64 lg:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar via, bairro ou código..."
                aria-label="Buscar ocorrências"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-9 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Limpar busca"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onOpenForm}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Ocorrência</span>
          </button>
        </div>
      </div>
    </header>
  );
}
