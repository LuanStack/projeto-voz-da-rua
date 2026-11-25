import { Camera, CheckCircle2, Map as MapIcon, PlusCircle, ShieldAlert, Users } from 'lucide-react';

export function AboutPilotView({ onGoToMap, onOpenForm, onGoToAdmin }) {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-[#102B46] via-[#13345b] to-[#1a497d] p-6 text-white shadow-md">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
          Protótipo Funcional • Belém do Pará
        </span>
        <h2 className="mt-3 text-2xl font-bold">Voz da Rua</h2>
        <p className="mt-1 text-sm text-sky-100">
          “A cidade informa. Todos se movimentam melhor.”
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sky-100/90">
          O Voz da Rua é um protótipo de plataforma colaborativa para registrar, localizar e consultar problemas nas vias públicas de Belém do Pará, reunindo evidências visuais, geolocalização e confirmação comunitária.
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onGoToMap}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#102B46] transition hover:bg-sky-50"
          >
            <MapIcon className="h-4 w-4 text-sky-600" />
            Explorar Mapa
          </button>
          <button
            type="button"
            onClick={onOpenForm}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-400"
          >
            <PlusCircle className="h-4 w-4" />
            Registrar Ocorrência
          </button>
          <button
            type="button"
            onClick={onGoToAdmin}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
          >
            Abrir Painel Admin (Demo)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#102B46]">
            <ShieldAlert className="h-5 w-5 text-sky-600" />
            <h3 className="text-sm font-bold">Independência e Transparência</h3>
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
            <li>
              • Plataforma <strong>independente</strong>: os registros não equivalem a protocolo oficial nem substituem canais de emergência ou solicitação formal junto à prefeitura.
            </li>
            <li>
              • Quando uma ocorrência é marcada como resolvida, trata-se de <strong>confirmação comunitária</strong> com data e histórico visíveis.
            </li>
            <li>
              • Todos os dados pré-carregados estão claramente identificados como <strong>Demonstração</strong> e as alterações ficam salvas apenas no <code>LocalStorage</code> deste navegador.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#102B46]">
            <Camera className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-bold">Segurança e Privacidade</h3>
          </div>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
            <li>
              • <strong>Nunca fotografe ou use o celular enquanto dirige</strong>. Faça o registro apenas em segurança.
            </li>
            <li>
              • Evite enquadrar rostos de pessoas, placas de veículos ou dados pessoais nas fotografias enviadas.
            </li>
            <li>
              • Registros sem atualização recente são sinalizados para incentivar a checagem pela comunidade.
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h3 className="flex items-center gap-2 text-sm font-bold text-[#102B46]">
          <Users className="h-4 w-4 text-sky-600" />
          Fluxo completo disponível neste protótipo
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              title: '1. Consulta e Filtros',
              desc: 'Filtre ocorrências por categoria, bairro de Belém, situação e busca textual com atualização simultânea no mapa e na lista.',
            },
            {
              title: '2. Registro Georreferenciado',
              desc: 'Clique diretamente no mapa para marcar coordenadas, anexe foto e publique no LocalStorage.',
            },
            {
              title: '3. Validação e Moderação',
              desc: 'Confirme se o problema continua, mudou ou foi resolvido, e teste a moderação no Painel Admin Demo.',
            },
          ].map((step) => (
            <div key={step.title} className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#102B46]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {step.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
