import { AlertCircle, Camera, CheckCircle2, Users } from 'lucide-react';

export function IndicatorsBar({ occurrences }) {
  const visible = occurrences.filter((item) => item.status !== 'arquivada');
  const activeCount = visible.filter((item) => item.status === 'ativa').length;
  const observationCount = visible.filter((item) => item.status === 'em_observacao').length;
  const resolvedCount = visible.filter((item) => item.status === 'resolvida_comunidade').length;

  const totalConfirmations = visible.reduce(
    (sum, item) =>
      sum +
      (item.confirmations?.stillExists || 0) +
      (item.confirmations?.changed || 0) +
      (item.confirmations?.resolved || 0),
    0
  );

  const withPhotoCount = visible.filter((item) => Boolean(item.photoDataUrl)).length;
  const photoPercentage = visible.length ? Math.round((withPhotoCount / visible.length) * 100) : 0;
  const coveredNeighborhoods = new Set(visible.map((item) => item.neighborhood)).size;

  const cards = [
    {
      label: 'Ocorrências em Aberto',
      value: activeCount + observationCount,
      detail: `${activeCount} ativas • ${observationCount} em observação`,
      icon: AlertCircle,
      iconBg: 'bg-sky-100 text-sky-700',
      borderAccent: 'border-l-4 border-l-sky-500',
    },
    {
      label: 'Confirmações Comunitárias',
      value: totalConfirmations,
      detail: 'Validações registradas nos relatos',
      icon: Users,
      iconBg: 'bg-[#102B46]/10 text-[#102B46]',
      borderAccent: 'border-l-4 border-l-[#102B46]',
    },
    {
      label: 'Resolvidas (Comunidade)',
      value: resolvedCount,
      detail: visible.length
        ? `${Math.round((resolvedCount / visible.length) * 100)}% do total visível`
        : 'Nenhum registro visível',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100 text-emerald-700',
      borderAccent: 'border-l-4 border-l-emerald-500',
    },
    {
      label: 'Registros com Foto',
      value: `${photoPercentage}%`,
      detail: `${withPhotoCount} de ${visible.length} relatos • ${coveredNeighborhoods} bairros`,
      icon: Camera,
      iconBg: 'bg-sky-100 text-sky-700',
      borderAccent: 'border-l-4 border-l-emerald-400',
    },
  ];

  return (
    <section aria-label="Indicadores de ocorrências" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:shadow-sm ${card.borderAccent}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-[#102B46]">{card.value}</p>
              </div>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-600">{card.detail}</p>
          </div>
        );
      })}
    </section>
  );
}
