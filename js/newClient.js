import { getClients, saveClients, uid, findClient } from './clients.js';
import { validate, build } from './clientModel.js';

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
const errorsEl = document.getElementById('form-errors');

// support edit via ?edit=<id>
const params = new URLSearchParams(location.search);
if(params.get('edit')){
  const c = findClient(params.get('edit'));
  if(c){ populate(c); }
}

function populate(c){
  idInput.value = c.id;
  fields.name.value = c.name||'';
  fields.age.value = c.age||'';
  fields.email.value = c.email||'';
  fields.phone.value = c.phone||'';
  fields.goal.value = c.goal||'';
  fields.startDate.value = c.startDate||'';
  fields.history.value = (c.history||[]).join('\n');
  fields.exercises.value = (c.exercises||[]).join('\n');
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  errorsEl.textContent='';
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
  const errs = validate(payload);
  if(Object.keys(errs).length){
    errorsEl.innerHTML = Object.values(errs).map(x=>`<div>${x}</div>`).join('');
    return;
  }
  const id = idInput.value || uid();
  const clientObj = build(payload, id);
  const clients = getClients();
  const idx = clients.findIndex(c=>c.id===id);
  if(idx>=0) clients[idx]=clientObj; else clients.push(clientObj);
  saveClients(clients);
  // go to list
  location.href = 'list.html';
});

document.getElementById('cancel-btn').addEventListener('click', ()=> location.href = 'list.html');
