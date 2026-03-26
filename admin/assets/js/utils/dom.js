/* ===== DOM Helper Functions ===== */

export function $(sel, root = document) { return root.querySelector(sel); }
export function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);

  for (const [k, v] of Object.entries(props)) {
    if (k === 'className') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v);
  }

  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(typeof child === 'string' || typeof child === 'number' ? document.createTextNode(String(child)) : child);
  }

  return el;
}

export function clear(el) {
  el.innerHTML = '';
}

export function mount(parent, ...nodes) {
  clear(parent);
  parent.append(...nodes.flat());
}

export function currency(n) {
  return `₹${(Number(n) || 0).toLocaleString('en-IN')}`;
}

export function formatDate(d) {
  const date = new Date(d);
  if (isNaN(date)) return String(d);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' });
}

export function shortDate(d) {
  const date = new Date(d);
  if (isNaN(date)) return String(d);
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function truncate(str, len = 40) {
  return String(str).length > len ? String(str).slice(0, len) + '…' : String(str);
}

export function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
