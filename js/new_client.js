
import { getClients, saveClients, uid } from './clients.js';
import { validate, buildClient } from './client.js';

const form = document.getElementById('client-form');
const idInput = document.getElementById('client-id');
const fields = {
  name: document.getElementById('name'),
  age: document.getElementById('age'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  goal: document.getElementById('goal'),
  startDate: document.getElementById('startDate'),
  history: document.getElementById('history'),
  exercises: document.getElementById('exercises')
};
const errs = {
  name: document.getElementById('err-name'),
  age: document.getElementById('err-age'),
  email: document.getElementById('err-email'),
  phone: document.getElementById('err-phone')
};

// if URL has ?edit=id prefill the form (support link from list)
const params = new URLSearchParams(location.search);
if (params.get('edit')) {
  const id = params.get('edit');
  const clients = getClients();
  const c = clients.find(x=>x.id===id);
  if (c) populate(c);
}

function populate(c) {
  idInput.value = c.id;
  fields.name.value = c.name || '';
  fields.age.value = c.age || '';
  fields.email.value = c.email || '';
  fields.phone.value = c.phone || '';
  fields.goal.value = c.goal || '';
  fields.startDate.value = c.startDate || '';
  fields.history.value = (c.history || []).join('\n');
  fields.exercises.value = (c.exercises || []).join('\n');
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  clearErrs();
  const payload = {
    name: fields.name.value,
    age: fields.age.value,
    email: fields.email.value,
    phone: fields.phone.value,
    goal: fields.goal.value,
    startDate: fields.startDate.value,
    history: fields.history.value,
    exercises: fields.exercises.value
  };
  const errors = validate(payload);
  if (Object.keys(errors).length) {
    showErrors(errors);
    return;
  }
  const id = idInput.value || uid();
  const client = buildClient(payload, id);
  const clients = getClients();
  const idx = clients.findIndex(c=>c.id===id);
  if (idx >= 0) clients[idx] = client;
  else clients.push(client);
  saveClients(clients);
  // redirect to list page
  location.href = 'list.html';
});

document.getElementById('cancel').addEventListener('click', ()=> {
  location.href = 'list.html';
});

function clearErrs(){ Object.values(errs).forEach(e=>e.textContent=''); }
function showErrors(errors){ Object.keys(errors).forEach(k=>{ if (errs[k]) errs[k].textContent = errors[k]; }); }
