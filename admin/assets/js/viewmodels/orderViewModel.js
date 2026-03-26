import { state, setOrders } from "../utils/stateManager.js";

const ALLOWED_STATUSES = ["Pending", "Delivered", "Cancelled"];

export function createOrderViewModel() {
  function list() {
    return state.orders.map((o) => ({
      ...o,
      amount: Number(o.amount) || 0,
      status: String(o.status || "Pending"),
    }));
  }

  function updateStatus(orderId, nextStatus) {
    const status = ALLOWED_STATUSES.includes(nextStatus) ? nextStatus : "Pending";
    const nextOrders = state.orders.map((o) => {
      if (String(o.id) !== String(orderId)) return o;
      return { ...o, status };
    });
    setOrders(nextOrders);
  }

  return {
    list,
    updateStatus,
    allowedStatuses: [...ALLOWED_STATUSES],
  };
}
