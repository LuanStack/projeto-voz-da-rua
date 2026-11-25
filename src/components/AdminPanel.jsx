import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Download,
  Eye,
  Flag,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { CATEGORIES, STATUSES, getCategoryMeta, getStatusMeta } from '../data/belemData';
import { formatDateTimeBR } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

export function AdminPanel({
  occurrences,
  searchQuery,
  onChangeStatus,
  onApproveModeration,
  onDeleteOccurrence,
  onSelectOccurrence,
  onFocusOnMap,
  onResetDemo,
}) {
  const [queueFilter, setQueueFilter] = useState('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const stats = useMemo(() => {
    const byCategory = CATEGORIES.map((cat) => ({
      ...cat,
      count: occurrences.filter((o) => o.category === cat.id).length,
    })).sort((a, b) => b.count - a.count);

    const neighborhoodCounts = new Map();
    for (const item of occurrences) {
      neighborhoodCounts.set(
        item.neighborhood,
        (neighborhoodCounts.get(item.neighborhood) || 0) + 1
      );
    }
    const topNeighborhoods = Array.from(neighborhoodCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const withPhotos = occurrences.filter((o) => Boolean(o.photoDataUrl)).length;
    const photoPct = occurrences.length ? Math.round((withPhotos / occurrences.length) * 100) : 0;
    const moderationPending = occurrences.filter(
      (o) => o.status === 'em_moderacao' || o.flags > 0
    ).length;

    return {
      byCategory,
      topNeighborhoods,
      coveredNeighborhoods: neighborhoodCounts.size,
      photoPct,
      moderationPending,
    };
  }, [occurrences]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return occurrences.filter((item) => {
      if (queueFilter === 'moderation') {
        if (item.status !== 'em_moderacao' && item.flags === 0) return false;
      } else if (queueFilter !== 'all') {
        if (item.status !== queueFilter) return false;
      }

      if (!q) return true;
      return (
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.neighborhood.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q)
      );
    });
  }, [occurrences, queueFilter, searchQuery]);

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      prototype: 'Voz da Rua - Belém/PA (Demonstração LocalStorage)',
      totalRecords: occurrences.length,
      occurrences,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'voz-da-rua-belem-demo.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const maxCatCount = Math.max(1, ...stats.byCategory.map((c) => c.count));
  const maxNeighCount = Math.max(1, ...stats.topNeighborhoods.map((n) => n.count));

  return (
    <div className="space-y-5">
      {/* Aviso de modo demonstrativo */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-sky-200 bg-gradient-to-r from-[#102B46] to-[#164070] p-5 text-white shadow-sm lg:flex-row lg:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold">Painel Administrativo & Moderação (Demonstração)</h2>
              <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200 ring-1 ring-amber-300/30">
                Sem login real / sem backend
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-sky-100/85">
              Todas as ações de moderação, mudança de status e exclusão atualizam imediatamente o mapa e os indicadores no <strong>LocalStorage</strong> do navegador.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <Download className="h-4 w-4 text-sky-300" />
            Exportar JSON
          </button>
          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar Demo
          </button>
        </div>
      </div>

      {/* Gráficos agregados e metas ilustrativas do piloto */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Por Categoria */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#102B46]">
            <BarChart3 className="h-4 w-4 text-sky-600" />
            Ocorrências por Categoria
          </h3>
          <div className="mt-3 space-y-2.5">
            {stats.byCategory.slice(0, 6).map((cat) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                    <CategoryIcon categoryId={cat.id} className="h-3.5 w-3.5 text-slate-500" />
                    {cat.shortLabel}
                  </span>
                  <span className="font-bold text-[#102B46]">{cat.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round((cat.count / maxCatCount) * 100)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por Bairro */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#102B46]">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Principais Bairros (Belém)
          </h3>
          <div className="mt-3 space-y-2.5">
            {stats.topNeighborhoods.map((nb) => (
              <div key={nb.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{nb.name}</span>
                  <span className="font-bold text-[#102B46]">{nb.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-600 transition-all duration-300"
                    style={{ width: `${Math.round((nb.count / maxNeighCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metas ilustrativas do piloto */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-[#102B46]">
              Parâmetros Ilustrativos do Piloto
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Referência acadêmica de acompanhamento sobre os dados atuais do protótipo.
            </p>

            <div className="mt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Bairros com registros (meta: 9)</span>
                  <span className="font-bold text-[#102B46]">{stats.coveredNeighborhoods}/9</span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${Math.min(100, Math.round((stats.coveredNeighborhoods / 9) * 100))}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Registros com foto (meta: 70%)</span>
                  <span className="font-bold text-[#102B46]">{stats.photoPct}%</span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all"
                    style={{ width: `${Math.min(100, stats.photoPct)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Fila de moderação: {stats.moderationPending} item(ns)
            </div>
            <p className="mt-0.5 text-[11px] text-amber-800">
              Inclui relatos aguardando revisão ou sinalizados por duplicidade/erro.
            </p>
          </div>
        </div>
      </div>

      {/* Filtros da tabela de gestão */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#102B46]">
              Gestão e Moderação de Ocorrências ({filteredRows.length})
            </h3>
            <p className="text-xs text-slate-500">
              Altere a situação, aprove relatos pendentes ou remova registros de teste.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: `Todas (${occurrences.length})` },
              { id: 'moderation', label: `Moderação / Alertas (${stats.moderationPending})` },
              { id: 'ativa', label: 'Ativas' },
              { id: 'em_observacao', label: 'Em observação' },
              { id: 'resolvida_comunidade', label: 'Resolvidas' },
              { id: 'arquivada', label: 'Arquivadas' },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setQueueFilter(pill.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  queueFilter === pill.id
                    ? 'bg-[#102B46] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {filteredRows.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Nenhuma ocorrência encontrada neste filtro administrativo.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  <th className="py-2.5 pr-3">Código / Ocorrência</th>
                  <th className="px-3 py-2.5">Bairro</th>
                  <th className="px-3 py-2.5">Categoria</th>
                  <th className="px-3 py-2.5">Validações</th>
                  <th className="px-3 py-2.5">Situação (Editar)</th>
                  <th className="py-2.5 pl-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((item) => {
                  const cat = getCategoryMeta(item.category);
                  const st = getStatusMeta(item.status);
                  const isDeleting = confirmDeleteId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3 pr-3 align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-slate-500">
                            {item.id}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              item.isDemo
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {item.isDemo ? 'Demo' : 'Local'}
                          </span>
                          {item.flags > 0 && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                              <Flag className="h-2.5 w-2.5" />
                              {item.flags}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 font-bold text-[#102B46]">{item.title}</p>
                        <p className="text-[11px] text-slate-500">
                          Atualizado em {formatDateTimeBR(item.updatedAt || item.createdAt)}
                        </p>
                      </td>

                      <td className="px-3 py-3 align-top">
                        <span className="font-semibold text-slate-800">{item.neighborhood}</span>
                        <p className="max-w-[180px] truncate text-[11px] text-slate-500">
                          {item.address}
                        </p>
                      </td>

                      <td className="px-3 py-3 align-top">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cat.badgeClass}`}
                        >
                          <CategoryIcon categoryId={item.category} className="h-3 w-3" />
                          {cat.shortLabel}
                        </span>
                      </td>

                      <td className="px-3 py-3 align-top text-[11px] text-slate-700">
                        <p>
                          <strong>{item.confirmations?.stillExists || 0}</strong> existe
                        </p>
                        <p>
                          <strong>{item.confirmations?.changed || 0}</strong> mudou
                        </p>
                        <p className="text-emerald-700">
                          <strong>{item.confirmations?.resolved || 0}</strong> resolvida
                        </p>
                      </td>

                      <td className="px-3 py-3 align-top">
                        <select
                          aria-label={`Alterar situação de ${item.id}`}
                          value={item.status}
                          onChange={(e) => onChangeStatus(item.id, e.target.value)}
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-sky-500/20 ${st.badgeClass}`}
                        >
                          {STATUSES.map((statusOpt) => (
                            <option key={statusOpt.id} value={statusOpt.id}>
                              {statusOpt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 pl-3 text-right align-top">
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          {(item.status === 'em_moderacao' || item.flags > 0) && (
                            <button
                              type="button"
                              onClick={() => onApproveModeration(item.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-emerald-500"
                              title="Aprovar relato e limpar sinalizações"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Aprovar
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onSelectOccurrence(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#102B46] transition hover:bg-sky-50"
                            title="Abrir detalhes"
                          >
                            <Eye className="h-3.5 w-3.5 text-sky-600" />
                            Ver
                          </button>

                          <button
                            type="button"
                            onClick={() => onFocusOnMap(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#102B46] transition hover:bg-sky-50"
                            title="Localizar no mapa"
                          >
                            <MapPin className="h-3.5 w-3.5 text-sky-600" />
                            Mapa
                          </button>

                          {!isDeleting ? (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-700 transition hover:bg-red-100"
                              title="Excluir registro"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Excluir
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 p-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteOccurrence(item.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-red-700"
                              >
                                Confirmar
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-white"
                              >
                                Não
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
