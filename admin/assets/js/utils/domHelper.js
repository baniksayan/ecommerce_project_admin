export function el(tag, options = {}) {
  const node = document.createElement(tag);

  if (options.className) node.className = options.className;
  if (options.text != null) node.textContent = String(options.text);
  if (options.html != null) node.innerHTML = String(options.html);

  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      if (value == null) continue;
      node.setAttribute(key, String(value));
    }
  }

  if (options.on) {
    for (const [eventName, handler] of Object.entries(options.on)) {
      node.addEventListener(eventName, handler);
    }
  }

  if (options.children) {
    for (const child of options.children) {
      if (child == null) continue;
      node.append(child);
    }
  }

  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return value.toLocaleString(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export function formatDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.valueOf())) return String(isoDate);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}
