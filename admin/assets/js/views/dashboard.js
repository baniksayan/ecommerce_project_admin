/* ===== Dashboard View ===== */
import { h, mount, currency, formatDate, timeAgo } from '../utils/dom.js';
import { getState } from '../utils/store.js';
import { icon } from '../utils/icons.js';
import { metricCard, panel, dataTable, badge, orderBadge, btn } from '../components/ui.js';

export function renderDashboard(root) {
  const { products, orders, users, reviews, activityLog } = getState();

  const totalProducts = products.length;
  const totalOrders   = orders.length;
  const totalRevenue  = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const lowStock      = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStock    = products.filter(p => p.stock === 0).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const activeUsers   = users.filter(u => u.status === 'active').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;

  /* ---- KPI cards ---- */
  const kpiGrid = h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4' },
    metricCard({ label: 'Total Revenue', value: currency(totalRevenue), change: '+12.5%', changeDir: 'up', icon: 'analytics', color: 'green' }),
    metricCard({ label: 'Total Orders', value: totalOrders, change: '+8%', changeDir: 'up', icon: 'orders', color: 'blue' }),
    metricCard({ label: 'Total Products', value: totalProducts, icon: 'products', color: 'brand' }),
    metricCard({ label: 'Active Users', value: activeUsers, change: '+3', changeDir: 'up', icon: 'users', color: 'purple' }),
  );

  /* ---- Alerts row ---- */
  const alertCards = h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-3' },
    alertSmall('Pending Orders', pendingOrders, 'warning', 'orders'),
    alertSmall('Low Stock', lowStock, 'orange', 'inventory'),
    alertSmall('Out of Stock', outOfStock, 'danger', 'products'),
    alertSmall('Pending Reviews', pendingReviews, 'info', 'reviews'),
  );

  /* ---- Revenue Chart placeholder ---- */
  const chartPanel = panel({ title: 'Revenue Overview', subtitle: 'Last 6 months', actions: [
    btn('Export', { variant: 'default', size: 'sm', ic: 'download' }),
  ] },
    chartPlaceholder(getState().revenueData, 'Revenue (₹)'),
  );

  /* ---- Order Trend ---- */
  const trendPanel = panel({ title: 'Order Trend', subtitle: 'This week' },
    chartPlaceholder(getState().orderTrend, 'Orders'),
  );

  /* ---- Recent orders ---- */
  const recentOrders = panel({ title: 'Recent Orders', subtitle: `${orders.length} total`, actions: [
    btn('View All', { variant: 'ghost', size: 'sm', onClick: () => { window.location.hash = '#orders'; } }),
  ], noPad: true },
    dataTable({
      columns: [
        { label: 'Order', key: 'id', render: r => h('span', { className: 'font-semibold text-gray-900' }, r.id) },
        { label: 'Customer', key: 'customerName' },
        { label: 'Amount', key: 'total', render: r => h('span', { className: 'font-semibold' }, currency(r.total)) },
        { label: 'Status', render: r => orderBadge(r.status) },
        { label: 'Date', render: r => h('span', { className: 'text-gray-500 text-xs' }, formatDate(r.date)) },
      ],
      rows: orders.slice(0, 5),
      onRowClick: (r) => { window.location.hash = `#orders?id=${r.id}`; },
    }),
  );

  /* ---- Activity feed ---- */
  const feed = panel({ title: 'Recent Activity', subtitle: 'Latest events' },
    h('div', { className: 'space-y-4 max-h-[340px] overflow-y-auto' },
      ...activityLog.slice(0, 8).map(a =>
        h('div', { className: 'flex items-start gap-3' },
          h('div', { className: 'w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500', html: icon('onboarding', 'w-4 h-4') }),
          h('div', { className: 'flex-1 min-w-0' },
            h('p', { className: 'text-sm text-gray-800' }, h('strong', { className: 'font-semibold' }, a.user), ` ${a.action}`),
            h('p', { className: 'text-[11px] text-gray-400 mt-0.5' }, timeAgo(a.time)),
          ),
        )
      )
    )
  );

  /* ---- Low stock list ---- */
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5);
  const lowStockPanel = panel({ title: 'Low Stock Alert', subtitle: `${lowStockProducts.length} items`, noPad: true },
    lowStockProducts.length ? h('div', { className: 'divide-y divide-gray-100' },
      ...lowStockProducts.map(p =>
        h('div', { className: 'flex items-center gap-3 px-5 py-3 table-row-hover' },
          h('img', { src: p.image, alt: p.name, className: 'w-9 h-9 rounded-lg object-cover border border-gray-200', loading: 'lazy' }),
          h('div', { className: 'flex-1 min-w-0' },
            h('p', { className: 'text-sm font-semibold text-gray-800 truncate' }, p.name),
            h('p', { className: 'text-[11px] text-gray-500' }, p.category),
          ),
          badge(`${p.stock} left`, 'orange'),
        )
      )
    ) : h('div', { className: 'p-5 text-center text-sm text-gray-400' }, 'All stock levels are healthy'),
  );

  /* ---- Assemble ---- */
  mount(root,
    h('div', { className: 'space-y-6 view-enter' },
      kpiGrid,
      alertCards,
      h('div', { className: 'grid grid-cols-1 xl:grid-cols-3 gap-5' },
        h('div', { className: 'xl:col-span-2' }, chartPanel),
        trendPanel,
      ),
      h('div', { className: 'grid grid-cols-1 xl:grid-cols-3 gap-5' },
        h('div', { className: 'xl:col-span-2' }, recentOrders),
        h('div', { className: 'space-y-5' }, lowStockPanel, feed),
      ),
    )
  );
}

/* Helper: small alert card */
function alertSmall(label, count, variant, ic) {
  const bg = {
    warning: 'bg-amber-50 border-amber-200/60',
    orange:  'bg-orange-50 border-orange-200/60',
    danger:  'bg-red-50 border-red-200/60',
    info:    'bg-blue-50 border-blue-200/60',
  };
  const txt = {
    warning: 'text-amber-700',
    orange:  'text-orange-700',
    danger:  'text-red-600',
    info:    'text-blue-700',
  };
  return h('div', { className: `flex items-center gap-3 p-3 rounded-xl border ${bg[variant] || ''}` },
    h('div', { className: `w-9 h-9 rounded-lg flex items-center justify-center ${txt[variant] || ''} bg-white/60`, html: icon(ic, 'w-4 h-4') }),
    h('div', {},
      h('div', { className: `text-lg font-extrabold ${txt[variant] || ''}` }, String(count)),
      h('div', { className: 'text-[11px] text-gray-500 font-medium' }, label),
    ),
  );
}

/* Helper: CSS bar chart placeholder */
function chartPlaceholder(data, label) {
  const max = Math.max(...data.datasets, 1);
  return h('div', {},
    h('div', { className: 'flex items-end gap-2 h-44 mt-3' },
      ...data.datasets.map((val, i) => {
        const pct = Math.round((val / max) * 100);
        const bar = h('div', { className: 'flex-1 flex flex-col items-center gap-1' },
          h('div', { className: 'text-[10px] font-semibold text-gray-500' }, typeof val === 'number' && val >= 1000 ? `${(val/1000).toFixed(1)}k` : String(val)),
          h('div', {
            className: 'w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-lg transition-all hover:from-brand-600 hover:to-brand-500',
            style: { height: `${Math.max(pct, 4)}%` },
          }),
          h('div', { className: 'text-[10px] text-gray-400 mt-1' }, data.labels[i]),
        );
        return bar;
      })
    ),
    h('div', { className: 'text-[11px] text-gray-400 mt-2 text-center' }, label),
  );
}
