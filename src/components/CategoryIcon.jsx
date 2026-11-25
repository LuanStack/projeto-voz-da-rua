import {
  AlertTriangle,
  Ban,
  Construction,
  Lightbulb,
  ShieldAlert,
  TrafficCone,
  Trees,
  Waves,
} from 'lucide-react';

const ICON_MAP = {
  buraco: Construction,
  alagamento: Waves,
  interdicao: Ban,
  semaforo: TrafficCone,
  obstaculo: AlertTriangle,
  arvore: Trees,
  iluminacao: Lightbulb,
  outro: ShieldAlert,
};

export function CategoryIcon({ categoryId, className = 'w-4 h-4' }) {
  const Icon = ICON_MAP[categoryId] || ShieldAlert;
  return <Icon className={className} aria-hidden="true" />;
}
