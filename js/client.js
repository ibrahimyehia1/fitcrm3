
// client.js - validation & model
export function validate(payload) {
  const errors = {};
  if (!payload.name || !payload.name.trim()) errors.name = "Name is required.";
  if (payload.age === '' || payload.age === null || payload.age === undefined) errors.age = "Age is required.";
  else {
    const a = Number(payload.age);
    if (!Number.isFinite(a) || a <= 0) errors.age = "Age must be greater than 0.";
    if (a > 120) errors.age = "Please enter a realistic age.";
  }
  if (!payload.email || !payload.email.trim()) errors.email = "Email is required.";
  else {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(payload.email)) errors.email = "Invalid email format.";
  }
  if (!payload.phone || !payload.phone.trim()) errors.phone = "Phone is required.";
  else {
    const pre = /^\+?[0-9\s\-]{7,20}$/;
    if (!pre.test(payload.phone)) errors.phone = "Invalid phone format.";
  }
  return errors;
}

export function buildClient(data, id) {
  const history = [];
  if (data.history && data.history.trim()) {
    // split by new lines and trim
    data.history.trim().split('\n').forEach(s => { const t = s.trim(); if (t) history.push(t); });
  }
  const exercises = [];
  if (data.exercises && data.exercises.trim()) {
    data.exercises.trim().split('\n').forEach(s => { const t = s.trim(); if (t) exercises.push(t); });
  }
  return {
    id: id || data.id || ('id-' + Math.random().toString(36).slice(2,9)),
    name: String(data.name || '').trim(),
    age: Number(data.age) || null,
    email: String(data.email || '').trim(),
    phone: String(data.phone || '').trim(),
    goal: String(data.goal || '').trim(),
    startDate: data.startDate || null,
    history: history,
    exercises: exercises
  };
}
