import { state, setProducts } from "../utils/stateManager.js";

export function createProductViewModel() {
  const LOW_STOCK_THRESHOLD = 5;

  function list() {
    return state.products.map((p) => ({
      ...p,
      price: Number(p.price) || 0,
      stock: Number(p.stock) || 0,
      status: (Number(p.stock) || 0) > 0 ? "In Stock" : "Out of Stock",
      isLowStock: (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= LOW_STOCK_THRESHOLD,
    }));
  }

  function getById(id) {
    const numericId = Number(id);
    return state.products.find((p) => Number(p.id) === numericId) ?? null;
  }

  function add(productInput) {
    const nextId = state.products.reduce((maxId, p) => Math.max(maxId, Number(p.id) || 0), 0) + 1;

    const next = {
      id: nextId,
      name: String(productInput.name ?? "").trim(),
      category: String(productInput.category ?? "").trim(),
      price: Number(productInput.price) || 0,
      stock: Number(productInput.stock) || 0,
      imageUrl: String(productInput.imageUrl ?? "").trim(),
    };

    setProducts([next, ...state.products]);
    return next;
  }

  function update(id, productInput) {
    const numericId = Number(id);
    const nextProducts = state.products.map((p) => {
      if (Number(p.id) !== numericId) return p;
      return {
        ...p,
        name: String(productInput.name ?? p.name).trim(),
        category: String(productInput.category ?? p.category).trim(),
        price: Number(productInput.price ?? p.price) || 0,
        stock: Number(productInput.stock ?? p.stock) || 0,
        imageUrl: String(productInput.imageUrl ?? p.imageUrl).trim(),
      };
    });

    setProducts(nextProducts);
    return getById(numericId);
  }

  function remove(id) {
    const numericId = Number(id);
    setProducts(state.products.filter((p) => Number(p.id) !== numericId));
  }

  return {
    list,
    getById,
    add,
    update,
    remove,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
  };
}
