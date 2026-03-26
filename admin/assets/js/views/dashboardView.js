import { el, clear, formatCurrency } from "../utils/domHelper.js";

export function renderDashboardView(root, dashboardVM) {
  clear(root);

  const summary = dashboardVM.getSummary();

  const grid = el("div", { className: "cardGrid" });

  grid.append(
    card("Total Products", summary.totalProducts),
    card("Total Orders", summary.totalOrders),
    card("Total Revenue", formatCurrency(summary.totalRevenue)),
    card("Low Stock Items", summary.lowStockItems, "badge--low")
  );

  const detailsPanel = el("section", { className: "panel" });
  detailsPanel.append(
    el("div", {
      className: "panel__header",
      children: [
        el("div", { className: "panel__title", text: "Inventory Notes" }),
        el("div", { className: "kpiRow", children: [
          badge(`Low stock ≤ ${summary.lowStockThreshold}`, "badge--low"),
          badge(`Out of stock: ${summary.outOfStockItems}`, "badge--error"),
        ] }),
      ],
    }),
    el("div", {
      className: "panel__body",
      children: [
        el("div", {
          className: "muted",
          text:
            "This is static demo data, but the layout and state updates are API-ready (MVVM + state manager).",
        }),
      ],
    })
  );

  root.append(
    el("div", { className: "section", children: [grid, detailsPanel] })
  );
}

function card(label, value, badgeClass) {
  const valueNode =
    badgeClass != null
      ? el("span", { className: `badge ${badgeClass}`, text: value })
      : el("div", { className: "card__value", text: value });

  return el("div", {
    className: "card",
    children: [
      el("div", { className: "card__label", text: label }),
      badgeClass ? el("div", { className: "card__value", children: [valueNode] }) : valueNode,
    ],
  });
}

function badge(text, extraClass = "") {
  return el("span", { className: `badge ${extraClass}`.trim(), text });
}
