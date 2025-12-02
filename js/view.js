
import { getClients, saveClients, findClient } from './clients.js';

function qs(id){ return document.getElementById(id); }
const params = new URLSearchParams(location.search);
const id = params.get('id');
if (!id) {
  alert('No client specified.'); location.href='list.html';
}
const client = findClient(id);
if (!client) { alert('Client not found.'); location.href='list.html'; }

qs('client-name').textContent = client.name;
qs('d-name').textContent = client.name;
qs('d-age').textContent = client.age || '-';
qs('d-email').textContent = client.email || '-';
qs('d-phone').textContent = client.phone || '-';
qs('d-goal').textContent = client.goal || '-';
qs('d-start').textContent = client.startDate || '-';

function renderHistory(){
  const el = qs('d-history');
  el.innerHTML = '';
  if (!client.history || client.history.length === 0) { el.textContent = '-'; return; }
  const ul = document.createElement('ul');
  client.history.forEach(h => { const li = document.createElement('li'); li.textContent = h; ul.appendChild(li); });
  el.appendChild(ul);
}
function renderExercises(){
  const el = qs('d-exercises');
  el.innerHTML='';
  if (!client.exercises || client.exercises.length===0) { el.textContent = '-'; return; }
  const ul = document.createElement('ul');
  client.exercises.forEach(e => { const li = document.createElement('li'); li.textContent = e; ul.appendChild(li); });
  el.appendChild(ul);
}

renderHistory(); renderExercises();

qs('back').addEventListener('click', ()=> location.href='list.html');

// add new training note
qs('add-note').addEventListener('click', ()=>{
  const note = qs('new-note').value.trim();
  if (!note) return alert('Please enter a note.');
  client.history = client.history || [];
  client.history.push(note);
  // persist
  const clients = getClients();
  const idx = clients.findIndex(c=>c.id===client.id);
  if (idx>=0) clients[idx] = client;
  saveClients(clients);
  qs('new-note').value='';
  renderHistory();
});

// fetch suggested exercises (5) from Wger, fallback to local list
(async function fetchSuggested(){
  const listEl = qs('suggested');
  listEl.innerHTML = '<li>Loading...</li>';
  try {
    const resp = await fetch('https://wger.de/api/v2/exercise/?language=2&status=2&limit=100');
    if (!resp.ok) throw new Error('Wger failed');
    const data = await resp.json();
    const items = data.results || [];
    // shuffle
    for (let i = items.length-1; i>0; i--){ const j = Math.floor(Math.random()*(i+1)); [items[i],items[j]]=[items[j],items[i]]; }
    const picks = items.slice(0,5);
    listEl.innerHTML='';
    if (!picks.length) throw new Error('No picks');
    picks.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(p.name)}</strong><div>${escapeHtml((p.description||'').replace(/<[^>]+>/g,''))}</div>`;
      listEl.appendChild(li);
    });
  } catch(e) {
    listEl.innerHTML='';
    const fallback = ['Bodyweight Squats — 3x12','Push-ups — 3x10','Plank — 3 x 45s','Dumbbell Rows — 3x10 each side','Walking Lunges — 3x12'];
    fallback.forEach(f=>{ const li=document.createElement('li'); li.textContent=f; listEl.appendChild(li); });
  }
})();

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }
