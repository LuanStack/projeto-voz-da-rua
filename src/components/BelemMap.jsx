import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Compass, Eye, ThumbsUp } from 'lucide-react';
import {
  BELEM_CENTER,
  BELEM_DEFAULT_ZOOM,
  getCategoryMeta,
  getStatusMeta,
} from '../data/belemData';
import { formatRelativeTimeBR } from '../utils/formatters';

function createMarkerIcon(categoryId, statusId, isFocused) {
  const category = getCategoryMeta(categoryId);
  const isResolved = statusId === 'resolvida_comunidade';
  const isModeration = statusId === 'em_moderacao';
  const isArchived = statusId === 'arquivada';

  const pinColor = isResolved ? '#10b981' : isArchived ? '#64748b' : category.color;
  const ringColor = isFocused ? '#102B46' : '#ffffff';
  const scale = isFocused ? 'scale(1.18)' : 'scale(1)';
  const opacity = isArchived ? '0.65' : '1';
  const badgeText = isResolved ? '✓' : isModeration ? '?' : '!';

  return L.divIcon({
    className: 'custom-div-marker',
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    popupAnchor: [0, -36],
    html: `
      <div style="transform:${scale};opacity:${opacity};transition:transform 0.15s ease;display:flex;flex-direction:column;align-items:center;">
        <div style="width:32px;height:32px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:${pinColor};border:3px solid ${ringColor};box-shadow:0 6px 14px rgba(12,35,64,0.35);display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(45deg);color:#ffffff;font-weight:800;font-size:13px;line-height:1;">${badgeText}</span>
        </div>
      </div>
    `,
  });
}

function MapViewportController({ focusTarget, resetTrigger, isVisible }) {
  const map = useMap();

  useEffect(() => {
    if (!isVisible) return undefined;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map, isVisible]);

  useEffect(() => {
    if (focusTarget && typeof focusTarget.lat === 'number' && typeof focusTarget.lng === 'number') {
      map.flyTo([focusTarget.lat, focusTarget.lng], 15, { duration: 0.7 });
    }
  }, [focusTarget, map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(BELEM_CENTER, BELEM_DEFAULT_ZOOM, { duration: 0.7 });
    }
  }, [resetTrigger, map]);

  return null;
}

export function BelemMap({
  occurrences,
  focusedOccurrence,
  resetCenterTrigger,
  isVisible = true,
  onResetCenter,
  onSelectOccurrence,
  heightClass = 'h-[430px] sm:h-[520px] lg:h-[600px]',
}) {
  const iconsByKey = useMemo(() => {
    const map = new Map();
    for (const item of occurrences) {
      const focused = focusedOccurrence?.id === item.id;
      const key = `${item.category}-${item.status}-${focused ? '1' : '0'}`;
      if (!map.has(key)) {
        map.set(key, createMarkerIcon(item.category, item.status, focused));
      }
    }
    return map;
  }, [occurrences, focusedOccurrence]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className={`relative w-full ${heightClass}`}>
        <MapContainer
          center={BELEM_CENTER}
          zoom={BELEM_DEFAULT_ZOOM}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapViewportController
            focusTarget={focusedOccurrence}
            resetTrigger={resetCenterTrigger}
            isVisible={isVisible}
          />

          {occurrences.map((item) => {
            const category = getCategoryMeta(item.category);
            const status = getStatusMeta(item.status);
            const focused = focusedOccurrence?.id === item.id;
            const iconKey = `${item.category}-${item.status}-${focused ? '1' : '0'}`;

            return (
              <Marker
                key={item.id}
                position={[item.lat, item.lng]}
                icon={iconsByKey.get(iconKey)}
              >
                <Popup>
                  <div className="overflow-hidden bg-white text-slate-800">
                    {item.photoDataUrl && (
                      <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                        <img
                          src={item.photoDataUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        {item.isDemo && (
                          <span className="absolute top-2 left-2 rounded-full bg-[#102B46]/85 px-2 py-0.5 text-[10px] font-semibold text-white">
                            Demonstração
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${category.badgeClass}`}
                        >
                          {category.shortLabel}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
                          {status.label}
                        </span>
                      </div>

                      <h3 className="mt-2 text-sm font-bold leading-snug text-[#102B46]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">
                        <strong>{item.neighborhood}</strong> • {item.address}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-sky-600" />
                          {item.confirmations?.stillExists || 0} confirmações
                        </span>
                        <span>{formatRelativeTimeBR(item.updatedAt || item.createdAt)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectOccurrence(item)}
                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#102B46] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#13345b]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver detalhes e confirmar
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Botão flutuante para centralizar em Belém */}
        <button
          type="button"
          onClick={onResetCenter}
          className="absolute top-3 right-3 z-[500] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-[#102B46] shadow-md backdrop-blur-xs transition hover:bg-sky-50"
          title="Centralizar mapa em Belém"
        >
          <Compass className="h-4 w-4 text-sky-600" />
          <span className="hidden sm:inline">Centralizar Belém</span>
        </button>

        {/* Legenda compacta */}
        <div className="pointer-events-auto absolute bottom-3 left-3 z-[500] hidden rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2 text-[11px] text-slate-700 shadow-md backdrop-blur-xs sm:block">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-600" />
              Ativa / Risco
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-600" />
              Alagamento
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Resolvida (comunidade)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
