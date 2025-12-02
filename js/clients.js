
// clients.js - storage & helpers (module)
export const STORAGE_KEY = "fitcrm_clients_final_v1";

export function uid() { return 'id-' + Math.random().toString(36).slice(2,9); }

export function getClients() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch(e) { return []; }
}

export function saveClients(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

export function findClient(id) { return getClients().find(c => c.id === id); }

export function importSample(data) {
  // overwrite if empty; otherwise preserve existing and ensure sample clients present
  const existing = getClients();
  if (existing.length === 0) {
    saveClients(data);
    return data;
  }
  // merge by id without duplicating
  const map = new Map(existing.map(c=>[c.id,c]));
  data.forEach(d => { if(!map.has(d.id)) map.set(d.id,d); });
  const merged = Array.from(map.values());
  saveClients(merged);
  return merged;
}
