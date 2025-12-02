import { getClients, saveClients, importSample } from './clients.js';

const listEl = document.getElementById('client-list');
const search = document.getElementById('search');

document.getElementById('search-btn').addEventListener('click', ()=> render(search.value.trim()));
document.getElementById('clear-btn').addEventListener('click', ()=> { search.value=''; render(); });
document.getElementById('import-btn').addEventListener('click', async ()=> {
  try {
    const resp = await fetch('data/clients.json');
    const data = await resp.json();
    importSample(data);
    render();
    alert('Sample data imported (2 clients).');
  } catch(e){ alert('Import failed'); }
});

function render(q){
  const clients = getClients();
  let results = clients;
  if(q) results = clients.filter(c=>c.name.toLowerCase().includes(q.toLowerCase()));
  listEl.innerHTML = '';
  if(!results.length){ listEl.innerHTML = '<li class="client-item">No clients added yet.</li>'; return; }
  results.forEach(c=>{
    const li = document.createElement('li');
    li.className = 'client-item';
    li.innerHTML = `
      <div class="client-meta">
        <div>
          <a href="view.html?id=${encodeURIComponent(c.id)}"><strong>${escapeHtml(c.name)}</strong></a>
          <div class="muted">${escapeHtml(c.email)}</div>
        </div>
      </div>
      <div class="client-actions">
        <button onclick="location.href='view.html?id=${encodeURIComponent(c.id)}'">View</button>
        <button onclick="location.href='index.html?edit=${encodeURIComponent(c.id)}'">Edit</button>
        <button onclick="delClient('${c.id}')">Delete</button>
      </div>`;
    listEl.appendChild(li);
  });
}

window.delClient = function(id){
  if(!confirm('Delete this client?')) return;
  const clients = getClients().filter(c=>c.id!==id);
  saveClients(clients);
  render();
};

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }
render();
