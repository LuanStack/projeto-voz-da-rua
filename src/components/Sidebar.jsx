import {
  ClipboardList,
  Info,
  Map as MapIcon,
  MapPin,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { PILOT_CITIES } from '../data/belemData';

export function Sidebar({
  activeTab,
  onSelectTab,
  onOpenForm,
  onResetDemo,
  selectedCity,
  onSelectCity,
  moderationCount,
  totalCount,
  isMobileOpen,
  onCloseMobile,
}) {
  const navItems = [
    {
      id: 'map',
      label: 'Mapa e Ocorrências',
      icon: MapIcon,
      badge: totalCount,
    },
    {
      id: 'list',
      label: 'Lista Detalhada',
      icon: ClipboardList,
      badge: null,
    },
    {
      id: 'admin',
      label: 'Painel Admin (Demo)',
      icon: ShieldCheck,
      badge: moderationCount > 0 ? moderationCount : null,
      badgeUrgent: moderationCount > 0,
    },
    {
      id: 'about',
      label: 'Sobre o Piloto',
      icon: Info,
      badge: null,
    },
  ];

  const handleNavClick = (tabId) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[1150] bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[1200] flex w-72 flex-col bg-deep text-white shadow-2xl transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Marca */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 text-deep shadow-md">
              <MapPin className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">Voz da Rua</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/30">
                  Demo
                </span>
              </div>
              <p className="text-xs text-sky-200/80">Belém do Pará • Protótipo</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-sky-200 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Fechar menu lateral"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Slogan & Seletor de Cidade */}
        <div className="border-b border-white/10 px-5 py-4">
          <p className="mb-3 text-xs leading-relaxed text-sky-100/80 italic">
            “A cidade informa. Todos se movimentam melhor.”
          </p>

          <label htmlFor="pilot-city-select" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sky-300">
            Área de atuação
          </label>
          <select
            id="pilot-city-select"
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-[#13345b] px-3 py-2 text-sm font-medium text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
          >
            {PILOT_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.badge})
              </option>
            ))}
          </select>

          {selectedCity !== 'belem' && (
            <div className="mt-2.5 rounded-lg border border-amber-400/30 bg-amber-500/15 p-2.5 text-xs text-amber-100">
              <p className="font-semibold">Expansão futura</p>
              <p className="mt-0.5 text-[11px] text-amber-100/85">
                Neste protótipo, apenas <strong>Belém - PA</strong> possui dados demonstrativos ativos.
              </p>
              <button
                type="button"
                onClick={() => onSelectCity('belem')}
                className="mt-1.5 font-semibold text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
              >
                Voltar para Belém - PA
              </button>
            </div>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4" aria-label="Menu principal">
          <button
            type="button"
            onClick={() => {
              onCloseMobile();
              onOpenForm();
            }}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-950/30 transition hover:bg-emerald-400 active:scale-[0.99]"
          >
            <PlusCircle className="h-4 w-4" />
            Registrar Ocorrência
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-500/20 text-white ring-1 ring-sky-400/40'
                    : 'text-sky-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-300' : 'text-sky-300'}`} />
                  {item.label}
                </span>
                {item.badge !== null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.badgeUrgent
                        ? 'bg-amber-400 text-deep'
                        : 'bg-white/10 text-sky-100'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Rodapé do protótipo */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-[#071729]/80 p-3 text-xs text-sky-100/80">
            <p className="font-semibold text-white">Protótipo Local (Sem Backend)</p>
            <p className="mt-1 leading-relaxed text-[11px] text-sky-200/75">
              Registros salvos no <strong>LocalStorage</strong> do navegador. Plataforma independente, sem vínculo oficial com órgãos públicos.
            </p>
            <button
              type="button"
              onClick={onResetDemo}
              className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-sky-100 transition hover:bg-white/15 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restaurar dados demo
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
