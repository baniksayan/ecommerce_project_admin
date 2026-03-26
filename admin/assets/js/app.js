import { initState, state } from "./utils/stateManager.js";

import { productsSeed } from "./models/productModel.js";
import { ordersSeed } from "./models/orderModel.js";
import { usersSeed } from "./models/userModel.js";

import { createDashboardViewModel } from "./viewmodels/dashboardViewModel.js";
import { createProductViewModel } from "./viewmodels/productViewModel.js";
import { createOrderViewModel } from "./viewmodels/orderViewModel.js";

import { renderDashboardView } from "./views/dashboardView.js";
import { renderProductView } from "./views/productView.js";
import { renderOrderView } from "./views/orderView.js";
import { renderUserView } from "./views/userView.js";
import { renderSettingsView } from "./views/settingsView.js";

const ROUTES = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview",
  },
  products: {
    title: "Products",
    subtitle: "Manage inventory",
  },
  orders: {
    title: "Orders",
    subtitle: "Track and update status",
  },
  users: {
    title: "Users",
    subtitle: "Customer list",
  },
  settings: {
    title: "Settings",
    subtitle: "Preferences",
  },
};

function getRouteFromHash() {
  const hash = (window.location.hash || "").replace(/^#/, "").trim();
  if (!hash) return "dashboard";
  return Object.prototype.hasOwnProperty.call(ROUTES, hash) ? hash : "dashboard";
}

function setActiveNav(route) {
  document.querySelectorAll(".nav__item").forEach((a) => {
    const isActive = a.getAttribute("data-route") === route;
    a.classList.toggle("isActive", isActive);
  });
}

function setHeader(route) {
  const titleEl = document.getElementById("pageTitle");
  const subEl = document.getElementById("pageSubtitle");

  titleEl.textContent = ROUTES[route].title;
  subEl.textContent = ROUTES[route].subtitle;
}

function closeSidebarOnMobile() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("isOpen");
}

function renderRoute(route) {
  const main = document.getElementById("mainContent");

  setActiveNav(route);
  setHeader(route);

  const dashboardVM = createDashboardViewModel();
  const productVM = createProductViewModel();
  const orderVM = createOrderViewModel();

  if (route === "dashboard") renderDashboardView(main, dashboardVM);
  else if (route === "products") renderProductView(main, productVM);
  else if (route === "orders") renderOrderView(main, orderVM);
  else if (route === "users") renderUserView(main, state.users);
  else if (route === "settings") renderSettingsView(main);

  main.focus();
  closeSidebarOnMobile();
}

function boot() {
  initState({ products: productsSeed, orders: ordersSeed, users: usersSeed });

  const toggleBtn = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("isOpen");
  });

  window.addEventListener("hashchange", () => renderRoute(getRouteFromHash()));

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a.nav__item");
    if (!link) return;
    const route = link.getAttribute("data-route");
    if (!route) return;
    // allow default hash navigation, but close sidebar after
    setTimeout(() => closeSidebarOnMobile(), 0);
  });

  if (!window.location.hash) window.location.hash = "#dashboard";
  renderRoute(getRouteFromHash());
}

boot();
