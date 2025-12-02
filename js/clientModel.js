// clientModel.js - validation and model builder
export function validate(payload){
  const errors = {};
  if(!payload.name || !payload.name.trim()) errors.name = "Name is required.";
  if(payload.age===''||payload.age===null||payload.age===undefined) errors.age = "Age is required.";
  else {
    const a = Number(payload.age);
    if(!Number.isFinite(a) || a<=0) errors.age="Age must be > 0.";
    if(a>120) errors.age="Age must be realistic (<=120).";
  }
  if(!payload.email || !payload.email.trim()) errors.email = "Email required.";
  else {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!re.test(payload.email)) errors.email = "Invalid email format.";
  }
  if(!payload.phone || !payload.phone.trim()) errors.phone = "Phone required.";
  else {
    const pre = /^\+?[0-9\s\-]{7,20}$/;
    if(!pre.test(payload.phone)) errors.phone = "Invalid phone format.";
  }
  return errors;
}

export function build(payload, id){
  const history = [];
  if(payload.history && payload.history.trim()){
    payload.history.trim().split('\n').forEach(s=>{ const t=s.trim(); if(t) history.push(t); });
  }
  const exercises = [];
  if(payload.exercises && payload.exercises.trim()){
    payload.exercises.trim().split('\n').forEach(s=>{ const t=s.trim(); if(t) exercises.push(t); });
  }
  return {
    id: id || payload.id || ('id-'+Math.random().toString(36).slice(2,9)),
    name: String(payload.name || '').trim(),
    age: Number(payload.age) || null,
    email: String(payload.email || '').trim(),
    phone: String(payload.phone || '').trim(),
    goal: String(payload.goal || '').trim(),
    startDate: payload.startDate || null,
    history: history,
    exercises: exercises
  };
}
