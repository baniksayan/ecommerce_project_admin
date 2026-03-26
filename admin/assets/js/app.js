/* ===== Mandal Variety Admin — App Bootstrap ===== */

// --- Utilities ---
import { initStore } from './utils/store.js';
import { registerRoutes, setBeforeRoute, startRouter, navigate, getRoute } from './utils/router.js';
import { icon } from './utils/icons.js';
import { $ } from './utils/dom.js';

// --- Seed data ---
import * as seed from './models/seedData.js';

// --- Views ---
import { renderDashboard }  from './views/dashboard.js';
import { renderProducts }   from './views/products.js';
import { renderOrders }     from './views/orders.js';
import { renderUsers }      from './views/users.js';
import { renderInventory }  from './views/inventory.js';
import { renderAnalytics }  from './views/analytics.js';
import { renderReviews }    from './views/reviews.js';
import { renderAddresses }  from './views/addresses.js';
import { renderWishlist }   from './views/wishlist.js';
import { renderCart }        from './views/cart.js';
import { renderCheckout }   from './views/checkout.js';
import { renderPolicies }   from './views/policies.js';
import { renderSettings }   from './views/settings.js';
import { renderAuth }        from './views/auth.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderContact }     from './views/contact.js';
import { renderTobacco }     from './views/tobacco.js';

/* ========================================================
   Navigation config
======================================================== */
const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { route: 'dashboard',  label: 'Dashboard',   icon: 'dashboard' },
      { route: 'analytics',  label: 'Analytics',   icon: 'analytics' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { route: 'products',   label: 'Products',    icon: 'products' },
      { route: 'orders',     label: 'Orders',      icon: 'orders' },
      { route: 'inventory',  label: 'Inventory',   icon: 'inventory' },
      { route: 'checkout',   label: 'Checkout',    icon: 'checkout' },
      { route: 'cart',       label: 'Cart',        icon: 'cart' },
      { route: 'wishlist',   label: 'Wishlist',    icon: 'wishlist' },
    ],
  },
  {
    label: 'Customers',
    items: [
      { route: 'users',      label: 'Users',       icon: 'users' },
      { route: 'addresses',  label: 'Addresses',   icon: 'addresses' },
      { route: 'reviews',    label: 'Reviews',     icon: 'reviews' },
      { route: 'contact',    label: 'Contact',     icon: 'contact' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { route: 'settings',   label: 'Settings',    icon: 'settings' },
      { route: 'policies',   label: 'Policies',    icon: 'policy' },
      { route: 'auth',       label: 'Auth',        icon: 'auth' },
      { route: 'onboarding', label: 'Onboarding',  icon: 'onboarding' },
      { route: 'tobacco',    label: 'Age Verify',  icon: 'tobacco' },
    ],
  },
];

/* ========================================================
   Route → view mapping
======================================================== */
const ROUTES = {
  dashboard:  (_r, _q) => renderDashboard($('#mainContent')),
  products:   (_r, _q) => renderProducts($('#mainContent')),
  orders:     (_r, _q) => renderOrders($('#mainContent')),
  users:      (_r, _q) => renderUsers($('#mainContent')),
  inventory:  (_r, _q) => renderInventory($('#mainContent')),
  analytics:  (_r, _q) => renderAnalytics($('#mainContent')),
  reviews:    (_r, _q) => renderReviews($('#mainContent')),
  addresses:  (_r, _q) => renderAddresses($('#mainContent')),
  wishlist:   (_r, _q) => renderWishlist($('#mainContent')),
  cart:       (_r, _q) => renderCart($('#mainContent')),
  checkout:   (_r, _q) => renderCheckout($('#mainContent')),
  policies:   (_r, _q) => renderPolicies($('#mainContent')),
  settings:   (_r, _q) => renderSettings($('#mainContent')),
  auth:       (_r, _q) => renderAuth($('#mainContent')),
  onboarding: (_r, _q) => renderOnboarding($('#mainContent')),
  contact:    (_r, _q) => renderContact($('#mainContent')),
  tobacco:    (_r, _q) => renderTobacco($('#mainContent')),
};

/* ========================================================
   Route metadata (page title & subtitle)
======================================================== */
const ROUTE_META = {
  dashboard:  { title: 'Dashboard',        subtitle: 'Overview & Analytics' },
  products:   { title: 'Products',          subtitle: 'Manage your catalog' },
  orders:     { title: 'Orders',            subtitle: 'Track & fulfill orders' },
  users:      { title: 'Users',             subtitle: 'Manage customers' },
  inventory:  { title: 'Inventory',         subtitle: 'Stock management' },
  analytics:  { title: 'Analytics',         subtitle: 'Insights & reports' },
  reviews:    { title: 'Reviews',           subtitle: 'Customer feedback' },
  addresses:  { title: 'Addresses',         subtitle: 'Delivery addresses' },
  wishlist:   { title: 'Wishlist',          subtitle: 'Saved items' },
  cart:       { title: 'Cart',              subtitle: 'Active shopping carts' },
  checkout:   { title: 'Checkout',          subtitle: 'Transactions & payments' },
  policies:   { title: 'Policies',          subtitle: 'Legal & compliance' },
  settings:   { title: 'Settings',          subtitle: 'Store configuration' },
  auth:       { title: 'Auth',              subtitle: 'Authentication settings' },
  onboarding: { title: 'Onboarding',        subtitle: 'Welcome screens' },
  contact:    { title: 'Contact',           subtitle: 'Customer messages' },
  tobacco:    { title: 'Age Verification',   subtitle: 'Tobacco compliance' },
};

/* ========================================================
   Build sidebar
======================================================== */
function buildSidebar() {
  const nav = $('#sidebarNav');
  nav.innerHTML = '';

  NAV_SECTIONS.forEach(section => {
    // Section label
    const lbl = document.createElement('div');
    lbl.className = 'text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 pt-1';
    lbl.textContent = section.label;
    nav.appendChild(lbl);

    // Items
    const ul = document.createElement('div');
    ul.className = 'space-y-0.5';

    section.items.forEach(item => {
      const a = document.createElement('a');
      a.href = '#' + item.route;
      a.dataset.route = item.route;
      a.className = 'nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-sb-hover transition-all duration-150 text-[13px] font-medium group';
      a.innerHTML = `
        <span class="flex-shrink-0 opacity-60 group-hover:opacity-100 transition">${icon(item.icon, 'w-[18px] h-[18px]')}</span>
        <span class="truncate">${item.label}</span>
      `;
      ul.appendChild(a);
    });

    nav.appendChild(ul);
  });
}

function highlightNav(route) {
  const navItems = document.querySelectorAll('#sidebarNav .nav-item');
  navItems.forEach(a => {
    const isActive = a.dataset.route === route;
    a.classList.toggle('bg-sb-active', isActive);
    a.classList.toggle('text-white', isActive);
    a.classList.toggle('text-slate-400', !isActive);
    // icon opacity
    const iconSpan = a.querySelector('span:first-child');
    if (iconSpan) {
      iconSpan.classList.toggle('opacity-100', isActive);
      iconSpan.classList.toggle('opacity-60', !isActive);
    }
  });
}

/* ========================================================
   Mobile sidebar
======================================================== */
function setupMobileSidebar() {
  const sidebar = $('#sidebar');
  const overlay = $('#sidebarOverlay');
  const toggle = $('#menuToggle');

  const open = () => {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  };
  const close = () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  };

  toggle.addEventListener('click', open);
  overlay.addEventListener('click', close);

  // Close sidebar on nav click (mobile)
  sidebar.addEventListener('click', e => {
    if (e.target.closest('.nav-item')) close();
  });
}

/* ========================================================
   Profile dropdown
======================================================== */
function setupProfileDropdown() {
  const btn = $('#profileBtn');
  const menu = $('#profileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    menu.classList.add('hidden');
  });
}

/* ========================================================
   Keyboard shortcuts
======================================================== */
function setupShortcuts() {
  document.addEventListener('keydown', e => {
    // CMD/CTRL + K → focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const search = $('#globalSearch');
      if (search) search.focus();
    }
  });
}

/* ========================================================
   Init
======================================================== */
function init() {
  // 1. Hydrate store
  initStore({
    products:       seed.products,
    categories:     seed.categories,
    orders:         seed.orders,
    users:          seed.users,
    reviews:        seed.reviews,
    addresses:      seed.addresses,
    wishlistItems:  seed.wishlistItems,
    cartItems:      seed.cartItems,
    checkouts:      seed.checkouts,
    activityLog:    seed.activityLog,
    revenueData:    seed.revenueData,
    orderTrend:     seed.orderTrend,
    policiesContent: seed.policiesContent,
    settingsData:   seed.settingsData,
  });

  // 2. Build UI chrome
  buildSidebar();
  setupMobileSidebar();
  setupProfileDropdown();
  setupShortcuts();

  // 3. Before-route hook (update title + active nav)
  setBeforeRoute(route => {
    const meta = ROUTE_META[route] || ROUTE_META.dashboard;
    const titleEl = $('#pageTitle');
    const subEl = $('#pageSubtitle');
    if (titleEl) titleEl.textContent = meta.title;
    if (subEl) subEl.textContent = meta.subtitle;
    highlightNav(route);

    // Scroll to top
    const main = $('#mainContent');
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
  });

  // 4. Register routes & start
  registerRoutes(ROUTES);
  startRouter();
}

// Boot
init();
