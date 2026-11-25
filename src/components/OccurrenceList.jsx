import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Crosshair,
  Eye,
  MapPin,
  PlusCircle,
  RotateCcw,
  ThumbsUp,
} from 'lucide-react';
import { getCategoryMeta, getStatusMeta } from '../data/belemData';
import { formatRelativeTimeBR, isOccurrenceStale } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

export function OccurrenceList({
  occurrences,
  focusedOccurrenceId,
  onFocusOnMap,
  onSelectOccurrence,
  onResetFilters,
  onOpenForm,
  gridLayout = false,
}) {
  if (occurrences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
          <MapPin className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-bold text-[#102B46]">
          Nenhuma ocorrência encontrada
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-600">
          Não há relatos que correspondam aos filtros ou à busca atual. Tente limpar os filtros ou registrar uma nova ocorrência em Belém.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Limpar filtros
          </button>
          <button
            type="button"
            onClick={onOpenForm}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <PlusCircle className="h-4 w-4" />
            Registrar ocorrência
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        gridLayout
          ? 'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'
          : 'flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-1'
      }
    >
      {occurrences.map((item) => {
        const category = getCategoryMeta(item.category);
        const status = getStatusMeta(item.status);
        const stale = isOccurrenceStale(item);
        const isFocused = focusedOccurrenceId === item.id;

        return (
          <article
            key={item.id}
            className={`group flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-xs transition hover:shadow-md ${
              isFocused
                ? 'border-sky-500 ring-2 ring-sky-500/20'
                : 'border-slate-200 hover:border-sky-300'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${category.badgeClass}`}
                  >
                    <CategoryIcon categoryId={item.category} className="h-3 w-3" />
                    {category.shortLabel}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${status.badgeClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
                    {status.label}
                  </span>
                </div>

                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    item.isDemo
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  }`}
                >
                  {item.isDemo ? 'Demo' : 'Novo (Local)'}
                </span>
              </div>

              <div className="mt-3 flex gap-3">
                {item.photoDataUrl && (
                  <img
                    src={item.photoDataUrl}
                    alt={item.title}
                    className="h-16 w-20 shrink-0 rounded-xl border border-slate-200 object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-bold text-[#102B46]">
                    {item.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-600">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-600" />
                    <span className="truncate">
                      {item.neighborhood} • {item.address}
                    </span>
                  </p>
                </div>
              </div>

              <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
                {item.description}
              </p>

              {stale && (
                <div className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  Registro antigo sem atualização recente — ajude confirmando a situação.
                </div>
              )}
            </div>

            <div className="mt-3.5 border-t border-slate-100 pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <ThumbsUp className="h-3.5 w-3.5 text-sky-600" />
                    {item.confirmations?.stillExists || 0}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {item.confirmations?.resolved || 0}
                  </span>
                  {item.photoDataUrl && (
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <Camera className="h-3.5 w-3.5" />
                      Foto
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTimeBR(item.updatedAt || item.createdAt)}
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onFocusOnMap(item)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#102B46] transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <Crosshair className="h-3.5 w-3.5 text-sky-600" />
                  No mapa
                </button>
                <button
                  type="button"
                  onClick={() => onSelectOccurrence(item)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#102B46] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#13345b]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Detalhes
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
