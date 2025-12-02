
// client.js - module for client validation & model
export function validateClient(payload) {
  const errors = {};
  if (!payload.name || !payload.name.trim()) errors.name = "Name is required.";
  if (!payload.email || !payload.email.trim()) errors.email = "Email is required.";
  else {
    // basic email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(payload.email)) errors.email = "Invalid email format.";
  }
  if (!payload.phone || !payload.phone.trim()) errors.phone = "Phone is required.";
  else {
    const pre = /^\+?[0-9\s\-]{7,20}$/;
    if (!pre.test(payload.phone)) errors.phone = "Invalid phone.";
  }
  if (!payload.age && payload.age !== 0) errors.age = "Age is required.";
  else {
    const age = Number(payload.age);
    if (!Number.isFinite(age) || age <= 0) errors.age = "Age must be a number greater than 0.";
    if (age > 120) errors.age = "Please use a realistic age.";
  }
  return errors;
}

export function createClientObject(data, id) {
  return {
    id: id || data.id || ('id-' + Math.random().toString(36).slice(2,9)),
    name: String(data.name || '').trim(),
    age: Number(data.age) || null,
    email: String(data.email || '').trim(),
    phone: String(data.phone || '').trim(),
    goal: String(data.goal || '').trim(),
    startDate: data.startDate || null,
    history: String(data.history || '').trim(),
    exercises: String(data.exercises || '').trim()
  };
}
