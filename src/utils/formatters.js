export function formatDateTimeBR(isoDate) {
  if (!isoDate) return 'Data indisponível';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Data inválida';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTimeBR(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs)) return '';

  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'agora mesmo';
  if (diffMinutes < 60) return `há ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `há ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'há 1 dia';
  return `há ${diffDays} dias`;
}

export function isOccurrenceStale(occurrence, thresholdDays = 14) {
  if (!occurrence || occurrence.status === 'resolvida_comunidade' || occurrence.status === 'arquivada') {
    return false;
  }
  const refTime = new Date(occurrence.updatedAt || occurrence.createdAt).getTime();
  if (Number.isNaN(refTime)) return false;
  const ageDays = (Date.now() - refTime) / (1000 * 60 * 60 * 24);
  return ageDays >= thresholdDays;
}
