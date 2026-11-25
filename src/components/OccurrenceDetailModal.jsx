import { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Crosshair,
  Flag,
  History,
  MapPin,
  RefreshCw,
  ShieldAlert,
  ThumbsUp,
  User,
  X,
} from 'lucide-react';
import { getCategoryMeta, getStatusMeta } from '../data/belemData';
import { formatDateTimeBR, formatRelativeTimeBR, isOccurrenceStale } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

export function OccurrenceDetailModal({
  occurrence,
  userActionState,
  onClose,
  onConfirmAction,
  onFocusOnMap,
}) {
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState('');

  if (!occurrence) return null;

  const category = getCategoryMeta(occurrence.category);
  const status = getStatusMeta(occurrence.status);
  const stale = isOccurrenceStale(occurrence);
  const voted = userActionState || {};

  const triggerAction = (actionType, successText) => {
    onConfirmAction(occurrence.id, actionType, note.trim());
    setNote('');
    setFeedback(successText);
  };

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-xs sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-[#102B46] px-5 py-4 text-white">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-xs font-semibold text-sky-100">
                {occurrence.id}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  occurrence.isDemo
                    ? 'bg-sky-400/20 text-sky-100 ring-1 ring-sky-300/30'
                    : 'bg-emerald-500/25 text-emerald-200 ring-1 ring-emerald-300/40'
                }`}
              >
                {occurrence.isDemo ? 'Dado Demonstrativo' : 'Registrado Localmente'}
              </span>
            </div>
            <h2 id="detail-modal-title" className="mt-1.5 text-lg font-bold leading-snug">
              {occurrence.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-sky-200 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar detalhes"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {/* Badges de categoria, situação e alerta de antiguidade */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${category.badgeClass}`}
            >
              <CategoryIcon categoryId={occurrence.category} className="h-3.5 w-3.5" />
              {category.label}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.badgeClass}`}
            >
              <span className={`h-2 w-2 rounded-full ${status.dotClass}`} />
              {status.label}
            </span>
            {occurrence.flags > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <Flag className="h-3 w-3" />
                {occurrence.flags} sinalização(ões)
              </span>
            )}
          </div>

          {stale && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">Registro antigo sem atualização recente</p>
                <p className="mt-0.5 text-amber-800">
                  Este relato não recebe confirmação há mais de 14 dias. Se você passou por esta via recentemente, confirme abaixo se o problema continua ou foi resolvido.
                </p>
              </div>
            </div>
          )}

          {/* Foto e informações principais */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {occurrence.photoDataUrl ? (
                <img
                  src={occurrence.photoDataUrl}
                  alt={occurrence.title}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 flex-col items-center justify-center p-4 text-center text-slate-500">
                  <Camera className="h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-xs font-semibold">Nenhuma fotografia anexada</p>
                  <p className="mt-0.5 text-[11px]">Relato enviado apenas com descrição e mapa.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                  <div>
                    <p className="font-bold text-[#102B46]">{occurrence.neighborhood} — Belém/PA</p>
                    <p className="text-slate-600">{occurrence.address}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                      Lat: {occurrence.lat.toFixed(5)} • Lng: {occurrence.lng.toFixed(5)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0 text-sky-600" />
                  <span>
                    Relatado por <strong>{occurrence.authorName}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-sky-600" />
                  <span>Criado em {formatDateTimeBR(occurrence.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-sky-600" />
                  <span>
                    Última atualização: {formatRelativeTimeBR(occurrence.updatedAt || occurrence.createdAt)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onFocusOnMap(occurrence)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-semibold text-[#102B46] transition hover:bg-sky-50"
              >
                <Crosshair className="h-3.5 w-3.5 text-sky-600" />
                Centralizar ponto no mapa
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#102B46]">
              Descrição da ocorrência
            </h3>
            <p className="mt-1.5 rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-700">
              {occurrence.description}
            </p>
          </div>

          {/* Confirmação comunitária */}
          <section className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#102B46]">
                  Confirmação Comunitária
                </h3>
                <p className="text-xs text-slate-600">
                  Passou por este local? Atualize a situação para ajudar quem circula por Belém.
                </p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-sky-800 ring-1 ring-sky-200">
                2+ confirmações de resolução encerram o relato
              </span>
            </div>

            <div className="mt-3">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Adicionar observação rápida opcional (ex.: 'Água já baixou', 'Buraco aumentou')..."
                maxLength={140}
                className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <button
                type="button"
                onClick={() =>
                  triggerAction(
                    'stillExists',
                    'Confirmação registrada: o problema continua existindo.'
                  )
                }
                disabled={Boolean(voted.stillExists) && !note.trim()}
                className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                  voted.stillExists && !note.trim()
                    ? 'cursor-not-allowed border-sky-300 bg-sky-100 text-sky-900 opacity-85'
                    : 'border-sky-300 bg-white text-[#102B46] shadow-xs hover:bg-sky-100/70'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-sky-600" />
                  <span>
                    Continua existindo
                    {voted.stillExists && (
                      <span className="block text-[10px] font-normal text-sky-700">
                        Você confirmou
                      </span>
                    )}
                  </span>
                </span>
                <span className="rounded-lg bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-900">
                  {occurrence.confirmations?.stillExists || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  triggerAction(
                    'changed',
                    'Atualização registrada: situação marcada como em observação.'
                  )
                }
                disabled={Boolean(voted.changed) && !note.trim()}
                className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                  voted.changed && !note.trim()
                    ? 'cursor-not-allowed border-amber-300 bg-amber-100 text-amber-900 opacity-85'
                    : 'border-amber-300 bg-white text-amber-950 shadow-xs hover:bg-amber-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-amber-600" />
                  <span>
                    Mudou / piorou
                    {voted.changed && (
                      <span className="block text-[10px] font-normal text-amber-700">
                        Você sinalizou
                      </span>
                    )}
                  </span>
                </span>
                <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                  {occurrence.confirmations?.changed || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  triggerAction(
                    'resolved',
                    'Confirmação de resolução registrada com base em relato comunitário.'
                  )
                }
                disabled={Boolean(voted.resolved) && !note.trim()}
                className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                  voted.resolved && !note.trim()
                    ? 'cursor-not-allowed border-emerald-300 bg-emerald-100 text-emerald-900 opacity-85'
                    : 'border-emerald-300 bg-emerald-600 text-white shadow-xs hover:bg-emerald-500'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    Foi resolvida
                    {voted.resolved && (
                      <span className="block text-[10px] font-normal">
                        Você confirmou
                      </span>
                    )}
                  </span>
                </span>
                <span
                  className={`rounded-lg px-2 py-0.5 text-xs font-bold ${
                    voted.resolved && !note.trim()
                      ? 'bg-emerald-200 text-emerald-950'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  {occurrence.confirmations?.resolved || 0}
                </span>
              </button>
            </div>

            {feedback && (
              <p className="mt-3 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white">
                {feedback}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-sky-200/70 pt-3">
              <p className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                <ShieldAlert className="h-3.5 w-3.5 text-sky-700" />
                Informação comunitária independente; não significa atendimento oficial pela prefeitura.
              </p>

              <button
                type="button"
                onClick={() =>
                  triggerAction(
                    'flag',
                    'Registro sinalizado para revisão no Painel Administrativo Demonstrativo.'
                  )
                }
                disabled={Boolean(voted.flagged)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  voted.flagged
                    ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                    : 'text-red-700 hover:bg-red-50'
                }`}
              >
                <Flag className="h-3.5 w-3.5" />
                {voted.flagged ? 'Já sinalizado por você' : 'Sinalizar duplicidade / erro'}
              </button>
            </div>
          </section>

          {/* Histórico */}
          <div>
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#102B46]">
              <History className="h-3.5 w-3.5 text-sky-600" />
              Histórico de atualizações ({occurrence.history?.length || 0})
            </h3>
            <ul className="mt-2 space-y-2">
              {(occurrence.history || []).map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-col justify-between gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:flex-row sm:items-center"
                >
                  <div>
                    <span className="font-bold text-[#102B46]">{entry.actor}: </span>
                    <span className="text-slate-700">{entry.message}</span>
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-500">
                    {formatDateTimeBR(entry.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
