import { state } from "../utils/stateManager.js";

export function createDashboardViewModel() {
  const LOW_STOCK_THRESHOLD = 5;

  function getSummary() {
    const totalProducts = state.products.length;
    const totalOrders = state.orders.length;
    const totalRevenue = state.orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    const lowStockItems = state.products.filter((p) => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= LOW_STOCK_THRESHOLD)
      .length;

    const outOfStockItems = state.products.filter((p) => (Number(p.stock) || 0) === 0).length;

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockItems,
      outOfStockItems,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
    };
  }

  return {
    getSummary,
  };
}
