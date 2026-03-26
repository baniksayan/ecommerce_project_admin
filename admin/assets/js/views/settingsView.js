import { el, clear } from "../utils/domHelper.js";

export function renderSettingsView(root) {
  clear(root);

  root.append(
    el("section", {
      className: "panel",
      children: [
        el("div", {
          className: "panel__header",
          children: [el("div", { className: "panel__title", text: "Settings" })],
        }),
        el("div", {
          className: "panel__body",
          children: [
            el("div", {
              className: "muted",
              text: "Settings UI placeholder (no extra features added).",
            }),
          ],
        }),
      ],
    })
  );
}
