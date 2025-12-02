
import { getClients, saveClients, importSample } from './clients.js';

const listEl = document.getElementById('client-list');
const searchInput = document.getElementById('search');

document.getElementById('search-btn').addEventListener('click', ()=> render(searchInput.value.trim()));
document.getElementById('clear-btn').addEventListener('click', ()=> { searchInput.value=''; render(); });
document.getElementById('import-btn').addEventListener('click', async ()=> {
  try {
    const resp = await fetch('data/clients.json');
    const data = await resp.json();
    importSample(data);
    render();
    alert('Sample data imported (non-destructive).');
  } catch(e){ alert('Import failed.'); }
});

function render(q){
  const clients = getClients();
  let results = clients;
  if (q) {
    const qq = q.toLowerCase();
    results = clients.filter(c => c.name.toLowerCase().includes(qq));
  }
  listEl.innerHTML='';
  if (!results.length) { listEl.innerHTML = '<li>No clients found.</li>'; return; }
  results.forEach(c => {
    const li = document.createElement('li');
    const meta = document.createElement('div');
    meta.className='client-meta';
    meta.innerHTML = `<div><a href="view.html?id=${encodeURIComponent(c.id)}" class="client-link"><strong>${escapeHtml(c.name)}</strong></a><div class="muted">${escapeHtml(c.email)}</div></div>`;
    const actions = document.createElement('div');
    actions.className='client-actions';
    const viewBtn = document.createElement('button'); viewBtn.textContent='View'; viewBtn.addEventListener('click', ()=> location.href = 'view.html?id='+encodeURIComponent(c.id));
    const editBtn = document.createElement('button'); editBtn.textContent='Edit'; editBtn.addEventListener('click', ()=> location.href = 'index.html?edit='+encodeURIComponent(c.id));
    const delBtn = document.createElement('button'); delBtn.textContent='Delete'; delBtn.addEventListener('click', ()=> del(c.id));
    actions.appendChild(viewBtn); actions.appendChild(editBtn); actions.appendChild(delBtn);
    li.appendChild(meta); li.appendChild(actions);
    listEl.appendChild(li);
  });
}

function del(id){
  if (!confirm('Delete this client? This action cannot be undone.')) return;
  const clients = getClients().filter(c=>c.id!==id);
  saveClients(clients);
  render();
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }

// initial render
render();
