
import { getClients, saveClients, findClient, uid, importSampleData } from './clients.js';
import { validateClient, createClientObject } from './client.js';

const viewNew = document.getElementById('view-new');
const viewList = document.getElementById('view-list');
const viewClient = document.getElementById('view-client');

document.getElementById('nav-new').addEventListener('click', () => showView('new'));
document.getElementById('nav-list').addEventListener('click', () => { showView('list'); renderList(); });

function showView(name) {
  viewNew.classList.add('hidden');
  viewList.classList.add('hidden');
  viewClient.classList.add('hidden');
  if (name === 'new') viewNew.classList.remove('hidden');
  if (name === 'list') viewList.classList.remove('hidden');
  if (name === 'client') viewClient.classList.remove('hidden');
}

/* Form logic */
const form = document.getElementById('client-form');
const idInput = document.getElementById('client-id');
const inputs = {
  name: document.getElementById('name'),
  age: document.getElementById('age'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  goal: document.getElementById('goal'),
  startDate: document.getElementById('startDate'),
  history: document.getElementById('history'),
  exercises: document.getElementById('exercises')
};
const errEls = {
  name: document.getElementById('err-name'),
  age: document.getElementById('err-age'),
  email: document.getElementById('err-email'),
  phone: document.getElementById('err-phone')
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  const payload = {
    name: inputs.name.value,
    age: inputs.age.value,
    email: inputs.email.value,
    phone: inputs.phone.value,
    goal: inputs.goal.value,
    startDate: inputs.startDate.value,
    history: inputs.history.value,
    exercises: inputs.exercises.value
  };
  const errors = validateClient(payload);
  if (Object.keys(errors).length) {
    showErrors(errors);
    return;
  }
  const cid = idInput.value || uid();
  const clientObj = createClientObject(payload, cid);
  const clients = getClients();
  const idx = clients.findIndex(c => c.id === cid);
  if (idx >= 0) clients[idx] = clientObj;
  else clients.push(clientObj);
  saveClients(clients);
  resetForm();
  showView('list');
  renderList();
});

function clearErrors(){
  Object.values(errEls).forEach(el=>el.textContent='');
}
function showErrors(errors){
  Object.keys(errors).forEach(k => {
    if (errEls[k]) errEls[k].textContent = errors[k];
  });
}

/* Cancel */
document.getElementById('cancel-btn').addEventListener('click', () => {
  resetForm();
  showView('list');
});

/* Render client list */
function renderList(filterName) {
  const listEl = document.getElementById('client-list');
  const clients = getClients();
  let results = clients;
  if (filterName) {
    const q = filterName.toLowerCase();
    results = clients.filter(c=>c.name.toLowerCase().includes(q));
  }
  listEl.innerHTML = '';
  if (!results.length) {
    listEl.innerHTML = '<li>No clients found.</li>';
    return;
  }
  results.forEach(c => {
    const li = document.createElement('li');
    const meta = document.createElement('div');
    meta.className = 'client-meta';
    meta.innerHTML = `<div><strong>${escapeHtml(c.name)}</strong><div class="muted">${escapeHtml(c.email)}</div></div>`;
    const actions = document.createElement('div');
    actions.className = 'client-actions';
    const viewBtn = document.createElement('button'); viewBtn.textContent = 'View'; viewBtn.addEventListener('click', ()=>openClient(c.id));
    const editBtn = document.createElement('button'); editBtn.textContent = 'Edit'; editBtn.addEventListener('click', ()=>populateForm(c.id));
    const delBtn = document.createElement('button'); delBtn.textContent = 'Delete'; delBtn.addEventListener('click', ()=>deleteClient(c.id));
    actions.appendChild(viewBtn); actions.appendChild(editBtn); actions.appendChild(delBtn);
    li.appendChild(meta); li.appendChild(actions);
    listEl.appendChild(li);
  });
}

/* Populate form for edit */
function populateForm(id) {
  const c = findClient(id);
  if (!c) return alert("Client not found");
  idInput.value = c.id;
  inputs.name.value = c.name;
  inputs.age.value = c.age || '';
  inputs.email.value = c.email;
  inputs.phone.value = c.phone;
  inputs.goal.value = c.goal || '';
  inputs.startDate.value = c.startDate || '';
  inputs.history.value = c.history || '';
  inputs.exercises.value = c.exercises || '';
  document.getElementById('form-title').textContent = 'Edit Client';
  showView('new');
}

/* Delete with confirmation */
function deleteClient(id) {
  if (!confirm("Delete this client? This action cannot be undone.")) return;
  const clients = getClients().filter(c=>c.id!==id);
  saveClients(clients);
  renderList();
}

/* Reset form */
function resetForm(){
  idInput.value = '';
  form.reset();
  document.getElementById('form-title').textContent = 'Add Client';
  clearErrors();
}

/* Search */
document.getElementById('search-btn').addEventListener('click', ()=> {
  const q = document.getElementById('search').value.trim();
  renderList(q);
});
document.getElementById('clear-search').addEventListener('click', ()=> {
  document.getElementById('search').value = '';
  renderList();
});

/* Import sample data */
document.getElementById('import-data').addEventListener('click', async ()=> {
  try {
    const resp = await fetch('data/clients.json');
    const data = await resp.json();
    importSampleData(data);
    renderList();
    alert('Sample data imported (non-destructive).');
  } catch(e) {
    alert('Failed to import sample data.');
  }
});

/* Open client view */
function openClient(id) {
  const c = findClient(id);
  if (!c) return alert("Client not found");
  document.getElementById('client-name').textContent = c.name;
  document.getElementById('client-age').textContent = c.age || '-';
  document.getElementById('client-email').textContent = c.email || '-';
  document.getElementById('client-phone').textContent = c.phone || '-';
  document.getElementById('client-goal').textContent = c.goal || '-';
  document.getElementById('client-start').textContent = c.startDate || '-';
  document.getElementById('client-history').textContent = c.history || '-';
  document.getElementById('client-exercises').textContent = c.exercises || '-';
  fetchSuggestedExercises();
  showView('client');
}

/* Back */
document.getElementById('back-to-list').addEventListener('click', ()=> showView('list'));

/* Suggested exercises fetcher */
async function fetchSuggestedExercises() {
  const list = document.getElementById('suggested-exercises');
  list.innerHTML = '<li>Loading...</li>';
  try {
    const resp = await fetch('https://wger.de/api/v2/exercise/?language=2&status=2&limit=100');
    if (!resp.ok) throw new Error('Wger request failed');
    const data = await resp.json();
    const items = data.results || [];
    // shuffle and pick 5
    for (let i = items.length -1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    const picks = items.slice(0,5);
    if (!picks.length) throw new Error('No exercises returned');
    list.innerHTML = '';
    picks.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(p.name)}</strong><div>${escapeHtml((p.description||'').replace(/<[^>]+>/g,''))}</div>`;
      list.appendChild(li);
    });
  } catch (e) {
    // fallback
    list.innerHTML = '';
    const fallback = [
      'Bodyweight Squats — 3 sets x 12 reps',
      'Push-ups — 3 sets x 10 reps',
      'Plank — 3 x 45 seconds',
      'Dumbbell Rows — 3 sets x 10 reps each side',
      'Walking Lunges — 3 sets x 12 reps'
    ];
    fallback.forEach(f => {
      const li = document.createElement('li'); li.textContent = f; list.appendChild(li);
    });
  }
}

/* Escape helper */
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }

/* Init */
(function init(){
  // seed only if empty (keeps student's existing data)
  if (getClients().length === 0) {
    saveClients([
      { id: uid(), name: "Sample Client", age: 28, email: "sample@example.com", phone:"+201234567890", goal:"Lose 5 kg", startDate: "", history:"Initial consult done", exercises:"" }
    ]);
  }
  showView('list');
  renderList();
})();
