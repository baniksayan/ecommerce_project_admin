const listeners = new Set();

export const state = {
  products: [],
  orders: [],
  users: [],
};

export function initState(initialState) {
  state.products = [...(initialState.products ?? [])];
  state.orders = [...(initialState.orders ?? [])];
  state.users = [...(initialState.users ?? [])];
  notify();
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notify() {
  for (const listener of listeners) listener(state);
}

export function setProducts(nextProducts) {
  state.products = [...nextProducts];
  notify();
}

export function setOrders(nextOrders) {
  state.orders = [...nextOrders];
  notify();
}

export function setUsers(nextUsers) {
  state.users = [...nextUsers];
  notify();
}
