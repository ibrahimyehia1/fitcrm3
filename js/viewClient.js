import { findClient, getClients, saveClients } from './clients.js';

const params = new URLSearchParams(location.search);
const id = params.get('id');
if(!id){ alert('No client specified'); location.href='list.html'; }
const client = findClient(id);
if(!client){ alert('Client not found'); location.href='list.html'; }

document.getElementById('client-name').textContent = client.name;
document.getElementById('d-name').textContent = client.name;
document.getElementById('d-email').textContent = client.email;
document.getElementById('d-phone').textContent = client.phone;
document.getElementById('d-goal').textContent = client.goal || '-';
document.getElementById('d-start').textContent = client.startDate || '-';

function renderHistory(){
  const el = document.getElementById('d-history');
  el.innerHTML = '';
  if(!client.history || !client.history.length){ el.textContent = '-'; return; }
  client.history.forEach(h=>{ const li = document.createElement('li'); li.textContent = h; el.appendChild(li); });
}
function renderExercises(){
  const el = document.getElementById('d-exercises');
  el.innerHTML = '';
  if(!client.exercises || !client.exercises.length){ el.textContent = '-'; return; }
  client.exercises.forEach(e=>{ const li = document.createElement('li'); li.textContent = e; el.appendChild(li); });
}

renderHistory(); renderExercises();

document.getElementById('back-btn').addEventListener('click', ()=> location.href='list.html');

// Add note functionality
document.getElementById('note-add').addEventListener('click', ()=>{
  const note = document.getElementById('note-input').value.trim();
  if(!note){ alert('Enter a note'); return; }
  client.history = client.history || [];
  client.history.push(note);
  const all = getClients();
  const idx = all.findIndex(c=>c.id===client.id);
  if(idx>=0) all[idx] = client;
  saveClients(all);
  document.getElementById('note-input').value='';
  renderHistory();
});

// Fetch 5 suggested exercises from Wger (language=2). If API fails, fallback to 5 local suggestions
(async function fetchSuggested(){
  const listEl = document.getElementById('suggested');
  listEl.innerHTML = '<li>Loading...</li>';
  try {
    const resp = await fetch('https://wger.de/api/v2/exercise/?language=2&status=2&limit=200');
    if(!resp.ok) throw new Error('Wger failed');
    const data = await resp.json();
    let items = data.results || [];
    // Filter items with name, shuffle, pick 5
    items = items.filter(i=>i.name).slice();
    for(let i=items.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [items[i],items[j]]=[items[j],items[i]]; }
    const picks = items.slice(0,5);
    listEl.innerHTML = '';
    picks.forEach(p=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(p.name)}</strong><div>${escapeHtml((p.description||'').replace(/<[^>]+>/g,''))}</div>`;
      listEl.appendChild(li);
    });
  } catch(e){
    listEl.innerHTML = '';
    const fallback = ['Bodyweight Squats — 3x12','Push-ups — 3x10','Plank — 3 x 45s','Dumbbell Rows — 3x10 each side','Walking Lunges — 3x12'];
    fallback.forEach(f=>{ const li=document.createElement('li'); li.textContent=f; listEl.appendChild(li); });
  }
})();

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }
