import { el, clear } from "../utils/domHelper.js";

export function renderUserView(root, users) {
  clear(root);

  const body = el("tbody");

  for (const u of users) {
    body.append(
      el("tr", {
        children: [
          el("td", { text: u.name }),
          el("td", { text: u.email }),
          el("td", { text: u.phone }),
          el("td", { children: [badgeFor(u.status)] }),
        ],
      })
    );
  }

  const table = el("table", {
    className: "table",
    children: [
      el("thead", {
        children: [
          el("tr", {
            children: [
              el("th", { text: "Name" }),
              el("th", { text: "Email" }),
              el("th", { text: "Phone" }),
              el("th", { text: "Status" }),
            ],
          }),
        ],
      }),
      body,
    ],
  });

  root.append(
    el("section", {
      className: "panel",
      children: [
        el("div", {
          className: "panel__header",
          children: [
            el("div", { className: "panel__title", text: "Users" }),
            el("div", { className: "muted", text: "Static list (ready for API later)" }),
          ],
        }),
        el("div", { className: "panel__body", children: [table] }),
      ],
    })
  );
}

function badgeFor(status) {
  if (status === "Active") return badge("Active", "badge--success");
  if (status === "Blocked") return badge("Blocked", "badge--error");
  return badge(String(status), "badge--info");
}

function badge(text, extraClass = "") {
  return el("span", { className: `badge ${extraClass}`.trim(), text });
}
