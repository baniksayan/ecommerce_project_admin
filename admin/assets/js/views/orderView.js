import { el, clear, formatCurrency, formatDate } from "../utils/domHelper.js";

export function renderOrderView(root, orderVM) {
  clear(root);

  const body = el("tbody");

  const table = el("table", {
    className: "table",
    children: [
      el("thead", {
        children: [
          el("tr", {
            children: [
              el("th", { text: "Order ID" }),
              el("th", { text: "Customer" }),
              el("th", { text: "Amount" }),
              el("th", { text: "Status" }),
              el("th", { text: "Date" }),
              el("th", { text: "Update" }),
            ],
          }),
        ],
      }),
      body,
    ],
  });

  const panel = el("section", {
    className: "panel",
    children: [
      el("div", {
        className: "panel__header",
        children: [
          el("div", { className: "panel__title", text: "Orders" }),
          el("div", { className: "muted", text: "Change status to update instantly" }),
        ],
      }),
      el("div", { className: "panel__body", children: [table] }),
    ],
  });

  root.append(el("div", { className: "section", children: [panel] }));

  renderRows();

  function renderRows() {
    body.replaceChildren();

    for (const order of orderVM.list()) {
      const statusBadge = badgeForStatus(order.status);

      const select = el("select", {
        className: "select",
        attrs: { "aria-label": `Update status for ${order.id}` },
      });
      for (const s of orderVM.allowedStatuses) {
        const opt = el("option", { text: s, attrs: { value: s } });
        if (s === order.status) opt.selected = true;
        select.append(opt);
      }

      select.addEventListener("change", () => {
        orderVM.updateStatus(order.id, select.value);
        renderRows();
      });

      body.append(
        el("tr", {
          children: [
            el("td", { text: order.id }),
            el("td", { text: order.customerName }),
            el("td", { text: formatCurrency(order.amount) }),
            el("td", { children: [statusBadge] }),
            el("td", { text: formatDate(order.date) }),
            el("td", { children: [select] }),
          ],
        })
      );
    }
  }
}

function badgeForStatus(status) {
  if (status === "Delivered") return badge("Delivered", "badge--success");
  if (status === "Cancelled") return badge("Cancelled", "badge--error");
  return badge("Pending", "badge--warning");
}

function badge(text, extraClass = "") {
  return el("span", { className: `badge ${extraClass}`.trim(), text });
}
