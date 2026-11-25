import { BELEM_NEIGHBORHOODS, createInitialDemoOccurrences } from '../data/belemData';

const STORAGE_KEYS = {
  OCCURRENCES: 'voz_da_rua_occurrences_v1',
  USER_ACTIONS: 'voz_da_rua_user_actions_v1',
  CITY: 'voz_da_rua_city_v1',
};

function safeReadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function loadOccurrences() {
  const stored = safeReadJson(STORAGE_KEYS.OCCURRENCES, null);
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  const seed = createInitialDemoOccurrences();
  safeWriteJson(STORAGE_KEYS.OCCURRENCES, seed);
  return seed;
}

export function saveOccurrences(occurrences) {
  return safeWriteJson(STORAGE_KEYS.OCCURRENCES, occurrences);
}

export function resetDemoData() {
  const seed = createInitialDemoOccurrences();
  safeWriteJson(STORAGE_KEYS.OCCURRENCES, seed);
  safeWriteJson(STORAGE_KEYS.USER_ACTIONS, {});
  return seed;
}

export function loadUserActions() {
  const stored = safeReadJson(STORAGE_KEYS.USER_ACTIONS, {});
  return typeof stored === 'object' && stored !== null ? stored : {};
}

export function saveUserActions(actions) {
  return safeWriteJson(STORAGE_KEYS.USER_ACTIONS, actions);
}

export function loadSelectedCity() {
  return safeReadJson(STORAGE_KEYS.CITY, 'belem');
}

export function saveSelectedCity(cityId) {
  return safeWriteJson(STORAGE_KEYS.CITY, cityId);
}

export function findNearestNeighborhood(lat, lng) {
  let closest = BELEM_NEIGHBORHOODS[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const neighborhood of BELEM_NEIGHBORHOODS) {
    const dLat = lat - neighborhood.lat;
    const dLng = lng - neighborhood.lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDistance) {
      minDistance = dist;
      closest = neighborhood;
    }
  }
  return closest.name;
}

export function generateOccurrenceId(existingList) {
  const numericSuffixes = existingList
    .map((item) => {
      const match = String(item.id || '').match(/(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .filter((n) => !Number.isNaN(n));
  const nextNumber = (numericSuffixes.length ? Math.max(...numericSuffixes) : 10) + 1;
  return `VR-2026-${String(nextNumber).padStart(3, '0')}`;
}
