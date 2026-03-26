/* ===== Reactive Store (Pub/Sub) ===== */
const _listeners = new Map();
let _state = {};

export function initStore(seed) {
  _state = structuredClone(seed);
  emit('*');
}

export function getState() {
  return _state;
}

export function setState(key, value) {
  _state[key] = Array.isArray(value) ? [...value] : (typeof value === 'object' && value !== null ? { ..._state[key], ...value } : value);
  emit(key);
  emit('*');
}

export function subscribe(key, fn) {
  if (!_listeners.has(key)) _listeners.set(key, new Set());
  _listeners.get(key).add(fn);
  return () => _listeners.get(key).delete(fn);
}

function emit(key) {
  const fns = _listeners.get(key);
  if (fns) fns.forEach(fn => fn(_state));
}

/* ===== CRUD helpers ===== */
export function addItem(key, item) {
  const list = [...(_state[key] || [])];
  const maxId = list.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0);
  const newItem = { ...item, id: maxId + 1 };
  list.unshift(newItem);
  setState(key, list);
  return newItem;
}

export function updateItem(key, id, patch) {
  const list = (_state[key] || []).map(x =>
    x.id === id ? { ...x, ...patch } : x
  );
  setState(key, list);
}

export function removeItem(key, id) {
  setState(key, (_state[key] || []).filter(x => x.id !== id));
}
