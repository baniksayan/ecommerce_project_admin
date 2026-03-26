/* ===== Simple Hash Router ===== */

let _routes = {};
let _currentRoute = '';
let _onBefore = null;

export function registerRoutes(routeMap) {
  _routes = routeMap;
}

export function setBeforeRoute(fn) {
  _onBefore = fn;
}

export function navigate(route) {
  window.location.hash = '#' + route;
}

export function getRoute() {
  return (window.location.hash || '#dashboard').replace(/^#/, '').split('?')[0] || 'dashboard';
}

export function getQuery() {
  const hash = window.location.hash || '';
  const idx = hash.indexOf('?');
  if (idx < 0) return {};
  const params = new URLSearchParams(hash.slice(idx + 1));
  const obj = {};
  for (const [k, v] of params) obj[k] = v;
  return obj;
}

export function startRouter() {
  const handleRoute = () => {
    const route = getRoute();
    if (route === _currentRoute) return;
    _currentRoute = route;
    if (_onBefore) _onBefore(route);
    const handler = _routes[route] || _routes['dashboard'];
    if (handler) handler(route, getQuery());
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
