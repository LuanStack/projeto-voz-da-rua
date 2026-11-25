export const BELEM_CENTER = [-1.4558, -48.4902];
export const BELEM_DEFAULT_ZOOM = 13;

export const PILOT_CITIES = [
  {
    id: 'belem',
    name: 'Belém - PA',
    active: true,
    badge: 'Piloto ativo',
    description: 'Área inicial de operação colaborativa',
  },
  {
    id: 'ananindeua',
    name: 'Ananindeua - PA',
    active: false,
    badge: 'Expansão prevista',
    description: 'Configuração de cidade planejada após piloto',
  },
  {
    id: 'marituba',
    name: 'Marituba - PA',
    active: false,
    badge: 'Expansão prevista',
    description: 'Expansão gradual na Região Metropolitana',
  },
];

export const BELEM_NEIGHBORHOODS = [
  { id: 'nazare', name: 'Nazaré', lat: -1.4525, lng: -48.4835 },
  { id: 'umarizal', name: 'Umarizal', lat: -1.4425, lng: -48.484 },
  { id: 'batista-campos', name: 'Batista Campos', lat: -1.4605, lng: -48.491 },
  { id: 'marco', name: 'Marco', lat: -1.4385, lng: -48.462 },
  { id: 'pedreira', name: 'Pedreira', lat: -1.4255, lng: -48.472 },
  { id: 'sao-bras', name: 'São Brás', lat: -1.45, lng: -48.4695 },
  { id: 'cidade-velha', name: 'Cidade Velha', lat: -1.457, lng: -48.504 },
  { id: 'jurunas', name: 'Jurunas', lat: -1.4715, lng: -48.495 },
  { id: 'guama', name: 'Guamá', lat: -1.471, lng: -48.4685 },
  { id: 'campina', name: 'Campina', lat: -1.452, lng: -48.4965 },
  { id: 'telegrafo', name: 'Telégrafo', lat: -1.4265, lng: -48.4875 },
  { id: 'cremacao', name: 'Cremação', lat: -1.4645, lng: -48.4775 },
];

export const CATEGORIES = [
  {
    id: 'buraco',
    label: 'Buraco na via',
    shortLabel: 'Buraco',
    color: '#ea580c',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    description: 'Afundamento, cratera ou desgaste severo no asfalto',
  },
  {
    id: 'alagamento',
    label: 'Alagamento / acúmulo de água',
    shortLabel: 'Alagamento',
    color: '#0284c7',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    description: 'Lâmina d’água, drenagem obstruída ou ponto alagável',
  },
  {
    id: 'interdicao',
    label: 'Interdição / bloqueio',
    shortLabel: 'Interdição',
    color: '#dc2626',
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
    description: 'Via bloqueada total ou parcialmente',
  },
  {
    id: 'semaforo',
    label: 'Semáforo defeituoso',
    shortLabel: 'Semáforo',
    color: '#d97706',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Semáforo apagado, intermitente ou com tempo irregular',
  },
  {
    id: 'obstaculo',
    label: 'Obstáculo / entulho',
    shortLabel: 'Obstáculo',
    color: '#7c3aed',
    badgeClass: 'bg-violet-50 text-violet-800 border-violet-200',
    description: 'Entulho, bueiro destampado ou objeto na pista/calçada',
  },
  {
    id: 'arvore',
    label: 'Árvore caída / risco',
    shortLabel: 'Árvore',
    color: '#0d9488',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    description: 'Galhos sobre a pista, tronco caído ou risco de queda',
  },
  {
    id: 'iluminacao',
    label: 'Iluminação precária',
    shortLabel: 'Iluminação',
    color: '#4f46e5',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    description: 'Trecho escuro ou postes apagados afetando a segurança',
  },
  {
    id: 'outro',
    label: 'Outro risco viário',
    shortLabel: 'Outro',
    color: '#475569',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Demais problemas que afetam a circulação na via',
  },
];

export const STATUSES = [
  {
    id: 'ativa',
    label: 'Ativa',
    badgeClass: 'bg-sky-50 text-sky-900 border-sky-200',
    dotClass: 'bg-sky-500',
    description: 'Problema relatado e visível para consulta comunitária',
  },
  {
    id: 'em_observacao',
    label: 'Em observação',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
    dotClass: 'bg-amber-500',
    description: 'Mudança sinalizada ou registro antigo aguardando nova checagem',
  },
  {
    id: 'resolvida_comunidade',
    label: 'Resolvida (comunidade)',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    dotClass: 'bg-emerald-500',
    description: 'Sinalizada como resolvida por relatos comunitários',
  },
  {
    id: 'em_moderacao',
    label: 'Em moderação',
    badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    dotClass: 'bg-indigo-500',
    description: 'Aguardando revisão no painel administrativo demonstrativo',
  },
  {
    id: 'arquivada',
    label: 'Arquivada / duplicada',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    dotClass: 'bg-slate-400',
    description: 'Registro encerrado ou ocultado do mapa público',
  },
];

export function getCategoryMeta(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
}

export function getStatusMeta(statusId) {
  return STATUSES.find((s) => s.id === statusId) || STATUSES[0];
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function createDemoPhotoSvg({ title, categoryLabel, accentColor, neighborhood, address }) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c2340"/>
        <stop offset="60%" stop-color="#13345b"/>
        <stop offset="100%" stop-color="#1e4976"/>
      </linearGradient>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="800" height="480" fill="url(#bg)"/>
    <rect width="800" height="480" fill="url(#grid)"/>
    <path d="M0 370 Q240 315 470 355 T800 320 L800 480 L0 480 Z" fill="#071729" opacity="0.72"/>
    <path d="M90 420 L370 285 L520 285 L710 420 Z" fill="#334155" opacity="0.65"/>
    <line x1="445" y1="292" x2="400" y2="418" stroke="#fbbf24" stroke-width="5" stroke-dasharray="16 14" opacity="0.8"/>
    <circle cx="430" cy="350" r="34" fill="${escapeXml(accentColor)}" opacity="0.28"/>
    <circle cx="430" cy="350" r="16" fill="${escapeXml(accentColor)}" stroke="#ffffff" stroke-width="3"/>
    <rect x="36" y="32" width="290" height="34" rx="17" fill="#10b981"/>
    <text x="54" y="54" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff">FOTO ILUSTRATIVA • DEMONSTRAÇÃO</text>
    <rect x="36" y="86" width="190" height="30" rx="8" fill="${escapeXml(accentColor)}"/>
    <text x="50" y="106" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#ffffff">${escapeXml(categoryLabel)}</text>
    <text x="36" y="162" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff">${escapeXml(title.slice(0, 44))}</text>
    <text x="36" y="200" font-family="system-ui, sans-serif" font-size="18" fill="#bae6fd">${escapeXml(neighborhood)} — Belém/PA</text>
    <text x="36" y="230" font-family="system-ui, sans-serif" font-size="15" fill="#cbd5e1">${escapeXml(address.slice(0, 62))}</text>
    <text x="36" y="452" font-family="system-ui, sans-serif" font-size="13" fill="#94a3b8">Voz da Rua • Evidência visual fictícia para validação de protótipo</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString();
const daysAgo = (d) => new Date(Date.now() - d * 24 * 3600 * 1000).toISOString();

export function createInitialDemoOccurrences() {
  return [
    {
      id: 'VR-2026-001',
      title: 'Buraco profundo na faixa da direita',
      category: 'buraco',
      neighborhood: 'Nazaré',
      address: 'Av. Nazaré, próximo à Av. Alcindo Cacela',
      description:
        'Afundamento no asfalto próximo à parada de ônibus, obrigando motoristas e ciclistas a desviar bruscamente em horário de pico.',
      lat: -1.4526,
      lng: -48.4818,
      status: 'ativa',
      moderationState: 'aprovada',
      createdAt: hoursAgo(6),
      updatedAt: hoursAgo(2),
      authorName: 'Camila S. (Demo)',
      photoDataUrl: createDemoPhotoSvg({
        title: 'Buraco profundo na faixa da direita',
        categoryLabel: 'Buraco na via',
        accentColor: '#ea580c',
        neighborhood: 'Nazaré',
        address: 'Av. Nazaré, próximo à Av. Alcindo Cacela',
      }),
      confirmations: { stillExists: 7, changed: 1, resolved: 0 },
      flags: 0,
      isDemo: true,
      history: [
        {
          id: 'h-101',
          timestamp: hoursAgo(6),
          type: 'criacao',
          actor: 'Camila S. (Demo)',
          message: 'Relato demonstrativo registrado com foto ilustrativa.',
        },
        {
          id: 'h-102',
          timestamp: hoursAgo(2),
          type: 'confirmacao',
          actor: 'Comunidade (Demo)',
          message: '7 moradores confirmaram que o problema continua existindo.',
        },
      ],
    },
    {
      id: 'VR-2026-002',
      title: 'Acúmulo de água após chuva forte',
      category: 'alagamento',
      neighborhood: 'Umarizal',
      address: 'Av. Visconde de Souza Franco (Doca), altura da Rua Domingos Marreiros',
      description:
        'Lâmina d’água cobrindo a pista lateral direita devido à drenagem lenta, dificultando a passagem de pedestres e motocicletas.',
      lat: -1.4418,
      lng: -48.4864,
      status: 'ativa',
      moderationState: 'aprovada',
      createdAt: hoursAgo(11),
      updatedAt: hoursAgo(4),
      authorName: 'Rafael T. (Demo)',
      photoDataUrl: createDemoPhotoSvg({
        title: 'Acúmulo de água após chuva forte',
        categoryLabel: 'Alagamento',
        accentColor: '#0284c7',
        neighborhood: 'Umarizal',
        address: 'Av. Visconde de Souza Franco (Doca)',
      }),
      confirmations: { stillExists: 11, changed: 2, resolved: 0 },
      flags: 0,
      isDemo: true,
      history: [
        {
          id: 'h-201',
          timestamp: hoursAgo(11),
          type: 'criacao',
          actor: 'Rafael T. (Demo)',
          message: 'Ocorrência demonstrativa cadastrada durante chuva.',
        },
        {
          id: 'h-202',
          timestamp: hoursAgo(4),
          type: 'confirmacao',
          actor: 'Comunidade (Demo)',
          message: 'Condição confirmada por entregadores e moradores locais.',
        },
      ],
    },
    {
      id: 'VR-2026-003',
      title: 'Semáforo intermitente no cruzamento',
      category: 'semaforo',
      neighborhood: 'Marco',
      address: 'Av. Almirante Barroso com Trav. Chaco',
      description:
        'Conjunto semafórico operando em amarelo piscante nos dois sentidos, gerando retenção e risco para travessia de pedestres.',
      lat: -1.4388,
      lng: -48.4648,
      status: 'em_observacao',
      moderationState: 'aprovada',
      createdAt: hoursAgo(19),
      updatedAt: hoursAgo(3),
      authorName: 'Eduardo P. (Demo)',
      photoDataUrl: createDemoPhotoSvg({
        title: 'Semáforo intermitente no cruzamento',
        categoryLabel: 'Semáforo defeituoso',
        accentColor: '#d97706',
        neighborhood: 'Marco',
        address: 'Av. Almirante Barroso x Trav. Chaco',
      }),
      confirmations: { stillExists: 5, changed: 3, resolved: 0 },
      flags: 0,
      isDemo: true,
      history: [
        {
          id: 'h-301',
          timestamp: hoursAgo(19),
          type: 'criacao',
          actor: 'Eduardo P. (Demo)',
          message: 'Relato demonstrativo aberto para o cruzamento.',
        },
        {
          id: 'h-302',
          timestamp: hoursAgo(3),
          type: 'mudanca',
          actor: 'Marina L. (Demo)',
          message: 'Sinalizado como "Mudou": voltou a piscar após breve normalização.',
        },
      ],
    },
    {
      id: 'VR-2026-004',
      title: 'Entulho obstruindo ciclofaixa e meia pista',
      category: 'obstaculo',
      neighborhood: 'Batista Campos',
      address: 'Rua dos Mundurucus, próximo à Trav. Padre Eutíquio',
      description:
        'Resíduos de obra e sacos de areia ocupando parte da ciclofaixa e da faixa de rolamento sem sinalização noturna.',
      lat: -1.4596,
      lng: -48.4914,
      status: 'ativa',
      moderationState: 'aprovada',
      createdAt: daysAgo(2),
      updatedAt: hoursAgo(14),
      authorName: 'Juliana F. (Demo)',
      photoDataUrl: createDemoPhotoSvg({
        title: 'Entulho obstruindo ciclofaixa',
        categoryLabel: 'Obstáculo / entulho',
        accentColor: '#7c3aed',
        neighborhood: 'Batista Campos',
        address: 'Rua dos Mundurucus x Padre Eutíquio',
      }),
      confirmations: { stillExists: 4, changed: 0, resolved: 0 },
      flags: 0,
      isDemo: true,
      history: [
        {
          id: 'h-401',
          timestamp: daysAgo(2),
          type: 'criacao',
          actor: 'Juliana F. (Demo)',
          message: 'Relato demonstrativo enviado por ciclista.',
        },
      ],
    },
    {
      id: 'VR-2026-005',
      title: 'Galhos caídos bloqueando trecho lateral',
      category: 'arvore',
      neighborhood: 'Pedreira',
      address: 'Av. Pedro Miranda, entre Trav. Timbó e Trav. Estrella',
      description:
        'Galhos de grande porte caídos junto ao meio-fio após ventania, reduzindo a visibilidade de quem entra na via.',
      lat: -1.4264,
      lng: -48.4706,
      status: 'ativa',
      moderationState: 'aprovada',
      createdAt: daysAgo(1),
      updatedAt: hoursAgo(8),
      authorName: 'Marcos V. (Demo)',
      photoDataUrl: createDemoPhotoSvg({
        title: 'Galhos caídos no trecho lateral',
        categoryLabel: 'Árvore caída / risco',
        accentColor: '#0d9488',
        neighborhood: 'Pedreira',
        address: 'Av. Pedro Miranda x Trav. Timbó',
      }),
      confirmations: { stillExists: 6, changed: 0, resolved: 1 },
      flags: 0,
      isDemo: true,
      history: [
        {
          id: 'h-501',
          timestamp: daysAgo(1),
          type: 'criacao',
          actor: 'Marcos V. (Demo)',
          message: 'Relato demonstrativo registrado com foto.',
        },
      ],
    },
    {
      id: 'VR-2026-006',
      title: 'Trecho escuro próximo a ponto de embarque',
      category: 'iluminacao',
      neighborhood: 'São Brás',
      address: 'Av. Governador José Malcher, próximo à Praça Floriano Peixoto',
      description:
        'Três luminárias consecutivas apagadas à noite, prejudicando a visibilidade de pedestres e motoristas.',
      lat: -1.4508,
      lng: -48.4709,
      status: 'ativa',
      moderationState: 'aprovada',
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
      authorName: 'Luciana B. (Demo)',
      photoDataUrl: '',
      confirmations: { stillExists: 3, changed: 0, resolved: 0 },
      flags: 0,
      isDemo: true,
      history: [
        {
          id: 'h-601',
          timestamp: daysAgo(3),
          type: 'criacao',
          actor: 'Luciana B. (Demo)',
          message: 'Registro demonstrativo sem foto (relato noturno).',
        },
      ],
    },
    {
      id: 'VR-2026-007',
      title: 'Via interditada por serviço emergencial',
      category: 'interdicao',
      neighborhood: 'Cidade Velha',
      address: 'Rua Dr. Assis, próximo à Praça do Carmo',
      description:
        'Cavaletes impedindo a passagem em uma quadra inteira; motoristas precisam desviar pela Rua Siqueira Mendes.',
      lat: -1.4578,
      lng: -48.5048,
      status: 'ativa',
      moderationState: 'aprovada',
      createdAt: hoursAgo(9),
      updatedAt: hoursAgo(5),
      authorName: 'Pedro H. (Demo)',
      photoDataUrl: createDemoPhotoSvg({
        title: 'Via interditada por serviço',
        categoryLabel: 'Interdição / bloqueio',
        accentColor: '#dc2626',
        neighborhood: 'Cidade Velha',
        address: 'Rua Dr. Assis x Praça do Carmo',
      }),
      confirmations: { stillExists: 8, changed: 0, resolved: 0 },
      flags: 0,
      isDemo: true,
      history: [
        {
          id: 'h-701',
          timestamp: hoursAgo(9),
          type: 'criacao',
          actor: 'Pedro H. (Demo)',
          message: 'Interdição demonstrativa cadastrada no centro histórico.',
        },
      ],
    },
    {
      id: 'VR-2026-008',
      title: 'Ponto recorrente de alagamento na esquina',
      category: 'alagamento',
      neighborhood: 'Jurunas',
      address: 'Rua dos Pariquis com Trav. Honório José dos Santos',
      description:
        'Registro antigo de alagamento recorrente em maré alta e chuva intensa. Necessita confirmação comunitária atualizada.',
      lat: -1.4712,
      lng: -48.4945,
      status: 'em_observacao',
      moderationState: 'aprovada',
      createdAt: daysAgo(18),
      updatedAt: daysAgo(16),
      authorName: 'Bianca R. (Demo)',
      photoDataUrl: createDemoPhotoSvg({
        title: 'Ponto recorrente de alagamento',
        categoryLabel: 'Alagamento',
        accentColor: '#0284c7',
        neighborhood: 'Jurunas',
        address: 'Rua dos Pariquis x Honório J. Santos',
      }),
      confirmations: { stillExists: 9, changed: 1, resolved: 1 },
      flags: 0,
      isDemo: true,
      history: [
        {
          id: 'h-801',
          timestamp: daysAgo(18),
          type: 'criacao',
          actor: 'Bianca R. (Demo)',
          message: 'Registro demonstrativo criado para ilustrar alerta de registro antigo.',
        },
      ],
    },
    {
      id: 'VR-2026-009',
      title: 'Bueiro destampado sinalizado com madeira',
      category: 'obstaculo',
      neighborhood: 'Guamá',
      address: 'Av. José Bonifácio, próximo à Rua Barão de Igarapé-Miri',
      description:
        'Tampa de galeria deslocada foi recolocada e a área voltou ao fluxo normal segundo confirmações de moradores.',
      lat: -1.4702,
      lng: -48.4694,
      status: 'resolvida_comunidade',
      moderationState: 'aprovada',
      createdAt: daysAgo(6),
      updatedAt: hoursAgo(12),
      authorName: 'Thiago N. (Demo)',
      photoDataUrl: createDemoPhotoSvg({
        title: 'Bueiro destampado — resolvido',
        categoryLabel: 'Obstáculo / entulho',
        accentColor: '#10b981',
        neighborhood: 'Guamá',
        address: 'Av. José Bonifácio x Barão de Igarapé-Miri',
      }),
      confirmations: { stillExists: 4, changed: 0, resolved: 5 },
      flags: 0,
      isDemo: true,
      history: [
        {
          id: 'h-901',
          timestamp: daysAgo(6),
          type: 'criacao',
          actor: 'Thiago N. (Demo)',
          message: 'Relato demonstrativo aberto.',
        },
        {
          id: 'h-902',
          timestamp: hoursAgo(12),
          type: 'resolvida',
          actor: 'Comunidade (Demo)',
          message: '5 moradores confirmaram que a passagem foi normalizada (relato comunitário).',
        },
      ],
    },
    {
      id: 'VR-2026-010',
      title: 'Possível registro duplicado na Av. Senador Lemos',
      category: 'buraco',
      neighborhood: 'Telégrafo',
      address: 'Av. Senador Lemos, próximo à Passagem Mirandinha',
      description:
        'Buraco na faixa de ônibus. Sinalizado para revisão de possível duplicidade com relato próximo.',
      lat: -1.4272,
      lng: -48.4871,
      status: 'em_moderacao',
      moderationState: 'pendente',
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(1),
      authorName: 'Colaborador (Demo)',
      photoDataUrl: createDemoPhotoSvg({
        title: 'Possível duplicidade — Av. Senador Lemos',
        categoryLabel: 'Buraco na via',
        accentColor: '#4f46e5',
        neighborhood: 'Telégrafo',
        address: 'Av. Senador Lemos x Pass. Mirandinha',
      }),
      confirmations: { stillExists: 1, changed: 0, resolved: 0 },
      flags: 2,
      isDemo: true,
      history: [
        {
          id: 'h-1001',
          timestamp: hoursAgo(5),
          type: 'criacao',
          actor: 'Colaborador (Demo)',
          message: 'Relato demonstrativo enviado.',
        },
        {
          id: 'h-1002',
          timestamp: hoursAgo(1),
          type: 'moderacao',
          actor: 'Sistema Demo',
          message: 'Encaminhado para fila de moderação após 2 sinalizações de duplicidade.',
        },
      ],
    },
  ];
}
