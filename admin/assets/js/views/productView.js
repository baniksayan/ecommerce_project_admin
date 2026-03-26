import { el, clear } from "../utils/domHelper.js";

export function renderProductView(root, productVM) {
  clear(root);

  let editingId = null;

  const tablePanel = el("section", { className: "panel" });
  const formPanel = el("section", { className: "panel" });

  const tableBody = el("tbody");

  const table = el("table", {
    className: "table",
    children: [
      el("thead", {
        children: [
          el("tr", {
            children: [
              th("Image"),
              th("Name"),
              th("Category"),
              th("Price"),
              th("Stock"),
              th("Status"),
              th("Actions"),
            ],
          }),
        ],
      }),
      tableBody,
    ],
  });

  tablePanel.append(
    el("div", {
      className: "panel__header",
      children: [
        el("div", { className: "panel__title", text: "Products" }),
        el("div", { className: "muted", text: `Low stock threshold: ${productVM.lowStockThreshold}` }),
      ],
    }),
    el("div", { className: "panel__body", children: [table] })
  );

  const nameInput = input("Name", { required: true, placeholder: "e.g., Banana" });
  const categoryInput = input("Category", { required: true, placeholder: "e.g., Fruits" });
  const priceInput = input("Price", { required: true, type: "number", min: "0", step: "1", placeholder: "e.g., 40" });
  const stockInput = input("Stock", { required: true, type: "number", min: "0", step: "1", placeholder: "e.g., 10" });
  const imageInput = input("Image URL", {
    required: true,
    type: "url",
    placeholder: "https://...",
  });

  const submitBtn = el("button", { className: "btn btn--primary", attrs: { type: "submit" }, text: "Add Product" });
  const cancelBtn = el("button", { className: "btn", attrs: { type: "button" }, text: "Cancel" });
  cancelBtn.classList.add("isHidden");

  const form = el("form", {
    on: {
      submit: (e) => {
        e.preventDefault();

        const payload = {
          name: nameInput.value,
          category: categoryInput.value,
          price: priceInput.value,
          stock: stockInput.value,
          imageUrl: imageInput.value,
        };

        if (editingId == null) {
          productVM.add(payload);
        } else {
          productVM.update(editingId, payload);
        }

        resetForm();
        renderTable();
      },
    },
    children: [
      el("div", { className: "panel__body", children: [
        el("div", { className: "formGrid", children: [
          nameInput.row,
          categoryInput.row,
          priceInput.row,
          stockInput.row,
          imageInput.row,
        ] }),
        el("div", { className: "actions", children: [submitBtn, cancelBtn] }),
      ] }),
    ],
  });

  formPanel.append(
    el("div", {
      className: "panel__header",
      children: [
        el("div", { className: "panel__title", text: "Add / Edit Product" }),
        el("div", { className: "muted", text: "Instant UI updates (local state)" }),
      ],
    }),
    form
  );

  cancelBtn.addEventListener("click", () => resetForm());

  root.append(el("div", { className: "grid2", children: [tablePanel, formPanel] }));

  renderTable();

  function renderTable() {
    tableBody.replaceWith((() => {
      const nextBody = el("tbody");
      for (const p of productVM.list()) {
        nextBody.append(row(p));
      }
      tableBody.replaceChildren(...nextBody.childNodes);
      return tableBody;
    })());
  }

  function row(p) {
    const statusBadge =
      p.status === "Out of Stock"
        ? badge("Out of Stock", "badge--error")
        : p.isLowStock
          ? badge("Low Stock", "badge--low")
          : badge("In Stock", "badge--success");

    return el("tr", {
      children: [
        el("td", {
          children: [
            el("img", {
              className: "thumb",
              attrs: { src: p.imageUrl, alt: p.name, loading: "lazy" },
            }),
          ],
        }),
        td(p.name),
        td(p.category),
        td(String(p.price)),
        td(String(p.stock)),
        el("td", { children: [statusBadge] }),
        el("td", {
          children: [
            el("div", {
              className: "actions",
              children: [
                el("button", {
                  className: "btn btn--small",
                  attrs: { type: "button" },
                  text: "Edit",
                  on: {
                    click: () => startEdit(p.id),
                  },
                }),
                el("button", {
                  className: "btn btn--small btn--danger",
                  attrs: { type: "button" },
                  text: "Delete",
                  on: {
                    click: () => {
                      productVM.remove(p.id);
                      if (editingId === p.id) resetForm();
                      renderTable();
                    },
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  function startEdit(id) {
    const p = productVM.getById(id);
    if (!p) return;

    editingId = p.id;
    submitBtn.textContent = "Update Product";
    cancelBtn.classList.remove("isHidden");

    nameInput.value = p.name;
    categoryInput.value = p.category;
    priceInput.value = String(p.price);
    stockInput.value = String(p.stock);
    imageInput.value = p.imageUrl;
  }

  function resetForm() {
    editingId = null;
    submitBtn.textContent = "Add Product";
    cancelBtn.classList.add("isHidden");

    nameInput.value = "";
    categoryInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
    imageInput.value = "";
  }
}

function th(text) {
  return el("th", { text });
}

function td(text) {
  return el("td", { text });
}

function badge(text, extraClass = "") {
  return el("span", { className: `badge ${extraClass}`.trim(), text });
}

function input(labelText, attrs = {}) {
  const control = el("input", { className: "input", attrs });
  const row = el("div", {
    className: "formRow",
    children: [el("div", { className: "label", text: labelText }), control],
  });

  return {
    row,
    get value() {
      return control.value;
    },
    set value(v) {
      control.value = v;
    },
  };
}
