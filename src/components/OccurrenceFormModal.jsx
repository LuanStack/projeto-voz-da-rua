import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import {
  Camera,
  Check,
  LocateFixed,
  MapPin,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  BELEM_CENTER,
  BELEM_NEIGHBORHOODS,
  CATEGORIES,
  createDemoPhotoSvg,
  getCategoryMeta,
} from '../data/belemData';
import { compressImageFile } from '../utils/imageUtils';
import { findNearestNeighborhood } from '../utils/storage';
import { CategoryIcon } from './CategoryIcon';

const pickerPinIcon = L.divIcon({
  className: 'custom-div-marker',
  iconSize: [36, 44],
  iconAnchor: [18, 42],
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;">
      <div style="width:34px;height:34px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:#10b981;border:3px solid #102B46;box-shadow:0 6px 14px rgba(12,35,64,0.35);display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);color:#ffffff;font-weight:800;font-size:16px;line-height:1;">+</span>
      </div>
    </div>
  `,
});

function LocationPickerController({ position, onPick }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    map.panTo([position.lat, position.lng]);
  }, [position.lat, position.lng, map]);

  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={pickerPinIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          onPick(latlng.lat, latlng.lng);
        },
      }}
    />
  );
}

export function OccurrenceFormModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('buraco');
  const [neighborhood, setNeighborhood] = useState('Nazaré');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [position, setPosition] = useState({
    lat: BELEM_CENTER[0],
    lng: BELEM_CENTER[1],
  });
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [safetyConfirmed, setSafetyConfirmed] = useState(false);
  const [hasManualNeighborhood, setHasManualNeighborhood] = useState(false);
  const [suggestedNeighborhood, setSuggestedNeighborhood] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [geoMessage, setGeoMessage] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleMapPick = (lat, lng) => {
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));
    setPosition({ lat: roundedLat, lng: roundedLng });
    const nearest = findNearestNeighborhood(roundedLat, roundedLng);
    if (!hasManualNeighborhood) {
      setNeighborhood(nearest);
      setSuggestedNeighborhood('');
      setGeoMessage(`Ponto selecionado no mapa (bairro sugerido: ${nearest}).`);
    } else if (nearest !== neighborhood) {
      setSuggestedNeighborhood(nearest);
      setGeoMessage(`Ponto atualizado no mapa. Localização próxima a ${nearest}.`);
    } else {
      setSuggestedNeighborhood('');
      setGeoMessage(`Ponto atualizado em ${neighborhood}.`);
    }
  };

  const handleNeighborhoodChange = (selectedName) => {
    setHasManualNeighborhood(true);
    setSuggestedNeighborhood('');
    setNeighborhood(selectedName);
    const found = BELEM_NEIGHBORHOODS.find((n) => n.name === selectedName);
    if (found) {
      setPosition({ lat: found.lat, lng: found.lng });
      setGeoMessage(`Mapa centralizado em ${found.name}. Clique no mapa para ajustar o ponto exato.`);
    }
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGeoMessage('Seu navegador não oferece suporte à geolocalização. Clique no mapa para marcar o ponto.');
      return;
    }

    setGeoMessage('Obtendo localização aproximada...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Verifica se está próximo da área de Belém (aprox. 50km)
        const nearBelem =
          latitude > -1.65 && latitude < -1.15 && longitude > -48.65 && longitude < -48.25;

        if (!nearBelem) {
          setGeoMessage(
            'Sua localização atual parece fora da região urbana de Belém. Ajuste o pino manualmente no mapa.'
          );
          return;
        }
        handleMapPick(latitude, longitude);
      },
      () => {
        setGeoMessage('Não foi possível acessar o GPS. Selecione o ponto diretamente no mapa.');
      },
      { timeout: 6000 }
    );
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingPhoto(true);
    setErrors((prev) => ({ ...prev, photo: '' }));
    try {
      const compressed = await compressImageFile(file);
      setPhotoDataUrl(compressed);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        photo: err instanceof Error ? err.message : 'Erro ao carregar fotografia.',
      }));
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleUseExamplePhoto = () => {
    const meta = getCategoryMeta(category);
    const sample = createDemoPhotoSvg({
      title: title.trim() || `${meta.shortLabel} em ${neighborhood}`,
      categoryLabel: meta.label,
      accentColor: meta.color,
      neighborhood,
      address: address.trim() || 'Via pública de Belém/PA',
    });
    setPhotoDataUrl(sample);
    setErrors((prev) => ({ ...prev, photo: '' }));
  };

  const validateAndSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!title.trim() || title.trim().length < 5) {
      nextErrors.title = 'Informe um título curto com pelo menos 5 caracteres.';
    }
    if (!address.trim() || address.trim().length < 4) {
      nextErrors.address = 'Informe a via ou ponto de referência próximo.';
    }
    if (!description.trim() || description.trim().length < 12) {
      nextErrors.description = 'Descreva o problema com pelo menos 12 caracteres.';
    }
    if (!safetyConfirmed) {
      nextErrors.safety = 'Confirme a orientação de segurança e privacidade antes de enviar.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      neighborhood,
      address: address.trim(),
      description: description.trim(),
      authorName: authorName.trim() || 'Cidadão Colaborador',
      lat: position.lat,
      lng: position.lng,
      photoDataUrl,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-xs sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
    >
      <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#102B46] px-5 py-4 text-white">
          <div>
            <h2 id="form-modal-title" className="text-lg font-bold">
              Registrar Nova Ocorrência em Belém
            </h2>
            <p className="text-xs text-sky-200">
              Relato salvo localmente no navegador (LocalStorage) • Sem vínculo oficial com a prefeitura
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-sky-200 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar formulário"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo rolável */}
        <form onSubmit={validateAndSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Coluna esquerda: Dados do relato */}
            <div className="space-y-4">
              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#102B46]">
                  1. Categoria do problema *
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const selected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                          selected
                            ? 'border-sky-600 bg-sky-50 text-[#102B46] ring-2 ring-sky-500/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: cat.color }}
                        >
                          <CategoryIcon categoryId={cat.id} className="h-3.5 w-3.5" />
                        </span>
                        <span className="truncate">{cat.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="occ-title" className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#102B46]">
                  2. Título resumido *
                </label>
                <input
                  id="occ-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder="Ex.: Buraco próximo à faixa de pedestres"
                  maxLength={90}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                />
                {errors.title && <p className="mt-1 text-xs font-medium text-red-600">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="occ-neighborhood" className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#102B46]">
                    3. Bairro *
                  </label>
                  <select
                    id="occ-neighborhood"
                    value={neighborhood}
                    onChange={(e) => handleNeighborhoodChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                  >
                    {BELEM_NEIGHBORHOODS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="occ-author" className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#102B46]">
                    Seu nome / apelido (opcional)
                  </label>
                  <input
                    id="occ-author"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Cidadão Colaborador"
                    maxLength={40}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="occ-address" className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#102B46]">
                  4. Via ou ponto de referência *
                </label>
                <input
                  id="occ-address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  placeholder="Ex.: Av. Almirante Barroso, próximo à Trav. Mauriti"
                  maxLength={120}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                />
                {errors.address && <p className="mt-1 text-xs font-medium text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="occ-description" className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#102B46]">
                  5. Descrição detalhada *
                </label>
                <textarea
                  id="occ-description"
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((prev) => ({ ...prev, description: '' }));
                  }}
                  placeholder="Explique o risco para motoristas, motociclistas, ciclistas ou pedestres..."
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{errors.description ? <span className="font-medium text-red-600">{errors.description}</span> : 'Seja objetivo e evite dados pessoais.'}</span>
                  <span>{description.length}/500</span>
                </div>
              </div>
            </div>

            {/* Coluna direita: Localização no mapa + Foto */}
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#102B46]">
                    6. Selecione a localização no mapa *
                  </span>
                  <button
                    type="button"
                    onClick={handleUseGps}
                    className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                  >
                    <LocateFixed className="h-3.5 w-3.5" />
                    Usar GPS
                  </button>
                </div>

                <div className="h-56 w-full overflow-hidden rounded-xl border border-slate-200">
                  <MapContainer
                    center={[position.lat, position.lng]}
                    zoom={14}
                    scrollWheelZoom
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPickerController position={position} onPick={handleMapPick} />
                  </MapContainer>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    Clique ou arraste o marcador verde: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                  </span>
                </div>
                {geoMessage && (
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-sky-50 px-2.5 py-1.5 text-[11px] text-sky-800">
                    <span>{geoMessage}</span>
                    {suggestedNeighborhood && (
                      <button
                        type="button"
                        onClick={() => {
                          setNeighborhood(suggestedNeighborhood);
                          setSuggestedNeighborhood('');
                        }}
                        className="font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
                      >
                        Usar {suggestedNeighborhood}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Fotografia */}
              <div>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#102B46]">
                    7. Fotografia da ocorrência (recomendado)
                  </span>
                  <button
                    type="button"
                    onClick={handleUseExamplePhoto}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    <Sparkles className="h-3 w-3 text-sky-600" />
                    Usar imagem de exemplo
                  </button>
                </div>

                {!photoDataUrl ? (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-sky-400 hover:bg-sky-50/40">
                    <Camera className="h-7 w-7 text-sky-600" />
                    <span className="mt-2 text-xs font-semibold text-[#102B46]">
                      {isProcessingPhoto ? 'Processando fotografia...' : 'Toque para anexar foto (JPG, PNG, WebP)'}
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-500">
                      A imagem é redimensionada localmente para salvar no navegador.
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </label>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={photoDataUrl}
                      alt="Pré-visualização da ocorrência"
                      className="h-40 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoDataUrl('')}
                      className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-lg bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remover
                    </button>
                  </div>
                )}
                {errors.photo && <p className="mt-1 text-xs font-medium text-red-600">{errors.photo}</p>}
              </div>

              {/* Aviso de segurança e privacidade */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={safetyConfirmed}
                    onChange={(e) => {
                      setSafetyConfirmed(e.target.checked);
                      setErrors((prev) => ({ ...prev, safety: '' }));
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    <strong className="text-[#102B46]">Segurança e privacidade:</strong> confirmo que não estou dirigindo e que a foto não expõe rostos, placas de veículos ou dados pessoais.
                  </span>
                </label>
                {errors.safety && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.safety}</p>}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldAlert className="h-4 w-4 text-sky-600" />
              Relato comunitário: não gera protocolo oficial junto à prefeitura.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
              >
                <Check className="h-4 w-4" />
                Publicar Ocorrência
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
