import { Map as MapIcon, ClipboardList, PlusCircle, ShieldCheck, Info, X } from 'lucide-react';

export function BottomNav({ activeTab, onSelectTab, onOpenForm, onSelectCity, selectedCity, moderationCount, totalCount }) {
  const navItems = [
    { id: 'map', label: 'Mapa', icon: MapIcon, badge: totalCount },
    { id: 'list', label: 'Lista', icon: ClipboardList },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, badge: moderationCount },
    { id: 'about', label: 'Sobre', icon: Info },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between bg-[#102B46] p-2 text-white lg:hidden">
      {/* Botão central de nova ocorrência */}
      <button
        type="button"
        onClick={onOpenForm}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 p-3 shadow-md hover:bg-emerald-400"
        aria-label="Registrar Ocorrência"
      >
        <PlusCircle className="h-5 w-5 text-white" />
      </button>
      {/* Itens de navegação */}
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center space-y-0.5 text-xs ${isActive ? 'text-emerald-300' : 'text-sky-200 hover:text-white'}`}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-300' : 'text-sky-200'}`} />
            <span>{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
