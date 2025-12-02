
// clients.js - module for storage & data utilities
export const STORAGE_KEY = "fitcrm_clients_v2";

export function uid() { return 'id-' + Math.random().toString(36).slice(2,9); }

export function getClients() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch(e) { return []; }
}

export function saveClients(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function findClient(id) {
  return getClients().find(c => c.id === id);
}

export function importSampleData(jsonData) {
  // merge but don't overwrite existing ids
  const existing = getClients();
  const ids = new Set(existing.map(c=>c.id));
  const toAdd = jsonData.filter(c => !ids.has(c.id));
  const merged = existing.concat(toAdd);
  saveClients(merged);
  return merged;
}
