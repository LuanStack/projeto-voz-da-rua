import { Filter, List, Map as MapIcon, RotateCcw } from 'lucide-react';
import { BELEM_NEIGHBORHOODS, CATEGORIES, STATUSES } from '../data/belemData';

export function FilterBar({
  filters,
  onChangeFilter,
  onResetFilters,
  filteredCount,
  totalCount,
  mobileView,
  onChangeMobileView,
  showMobileViewToggle = true,
}) {
  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.neighborhood !== 'all' ||
    filters.status !== 'all' ||
    filters.includeArchived;

  return (
    <section
      aria-label="Filtros de ocorrências"
      className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:p-4"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#102B46]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
            <Filter className="h-4 w-4" />
          </span>
          <span>Filtros</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            Exibindo {filteredCount} de {totalCount}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Limpar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center">
          <select
            aria-label="Filtrar por categoria"
            value={filters.category}
            onChange={(e) => onChangeFilter('category', e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white sm:text-sm"
          >
            <option value="all">Todas as categorias</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por bairro"
            value={filters.neighborhood}
            onChange={(e) => onChangeFilter('neighborhood', e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white sm:text-sm"
          >
            <option value="all">Todos os bairros de Belém</option>
            {BELEM_NEIGHBORHOODS.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por situação"
            value={filters.status}
            onChange={(e) => onChangeFilter('status', e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-sky-500 focus:bg-white sm:text-sm"
          >
            <option value="all">Todas as situações</option>
            {STATUSES.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 select-none hover:bg-slate-100">
            <input
              type="checkbox"
              checked={filters.includeArchived}
              onChange={(e) => onChangeFilter('includeArchived', e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            Mostrar arquivadas
          </label>
        </div>
      </div>

      {showMobileViewToggle && (
        <div className="mt-3 flex rounded-xl bg-slate-100 p-1 lg:hidden">
          <button
            type="button"
            onClick={() => onChangeMobileView('map')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
              mobileView === 'map'
                ? 'bg-[#102B46] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            Ver Mapa
          </button>
          <button
            type="button"
            onClick={() => onChangeMobileView('list')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
              mobileView === 'list'
                ? 'bg-[#102B46] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Ver Lista ({filteredCount})
          </button>
        </div>
      )}
    </section>
  );
}
