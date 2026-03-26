/* ===== Analytics View ===== */
import { h, mount, currency, formatDate } from '../utils/dom.js';
import { getState } from '../utils/store.js';
import { icon } from '../utils/icons.js';
import { panel, metricCard, badge, btn, dataTable } from '../components/ui.js';

export function renderAnalytics(root) {
  const { products, orders, users, revenueData, orderTrend } = getState();

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const avgOrderValue = orders.length ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0;

  /* KPIs */
  const kpis = h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5' },
    metricCard({ label: 'Total Revenue', value: currency(totalRevenue), change: '+12.5%', changeDir: 'up', icon: 'analytics', color: 'green' }),
    metricCard({ label: 'Avg. Order Value', value: currency(avgOrderValue), icon: 'orders', color: 'blue' }),
    metricCard({ label: 'Total Customers', value: users.length, change: '+3', changeDir: 'up', icon: 'users', color: 'purple' }),
    metricCard({ label: 'Conversion Rate', value: '3.8%', change: '+0.5%', changeDir: 'up', icon: 'onboarding', color: 'brand' }),
  );

  /* Revenue chart */
  const revenueChart = panel({ title: 'Revenue Trend', subtitle: 'Monthly breakdown', actions: [
    btn('Export', { size: 'sm', ic: 'download' }),
  ] }, barChart(revenueData, 'Revenue (₹)'));

  /* Order trend */
  const orderChart = panel({ title: 'Orders This Week', subtitle: 'Daily order count' },
    barChart(orderTrend, 'Orders'),
  );

  /* Category breakdown */
  const categorySales = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const cat = product?.category || 'Other';
      categorySales[cat] = (categorySales[cat] || 0) + (item.qty * item.price);
    });
  });
  const catEntries = Object.entries(categorySales).sort((a, b) => b[1] - a[1]);
  const maxCat = catEntries.length ? catEntries[0][1] : 1;

  const categoryPanel = panel({ title: 'Sales by Category' },
    h('div', { className: 'space-y-3' },
      ...catEntries.map(([cat, val]) =>
        h('div', {},
          h('div', { className: 'flex items-center justify-between text-sm mb-1' },
            h('span', { className: 'font-medium text-gray-700' }, cat),
            h('span', { className: 'font-semibold text-gray-900' }, currency(val)),
          ),
          h('div', { className: 'h-2 bg-gray-100 rounded-full overflow-hidden' },
            h('div', { className: 'h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all', style: { width: `${Math.round((val / maxCat) * 100)}%` } }),
          ),
        )
      ),
      !catEntries.length ? h('p', { className: 'text-sm text-gray-400 text-center py-4' }, 'No sales data') : null,
    ),
  );

  /* Payment methods */
  const payMethods = {};
  orders.forEach(o => { payMethods[o.paymentMethod] = (payMethods[o.paymentMethod] || 0) + 1; });
  const payEntries = Object.entries(payMethods).sort((a, b) => b[1] - a[1]);

  const payPanel = panel({ title: 'Payment Methods' },
    h('div', { className: 'space-y-3' },
      ...payEntries.map(([method, count]) =>
        h('div', { className: 'flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100' },
          h('span', { className: 'font-medium text-sm' }, method),
          h('div', { className: 'flex items-center gap-2' },
            h('span', { className: 'text-sm font-bold text-gray-900' }, String(count)),
            badge(`${Math.round((count / orders.length) * 100)}%`, 'brand'),
          ),
        )
      ),
    ),
  );

  /* Top products */
  const productSales = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      productSales[item.productId] = (productSales[item.productId] || { name: item.name, qty: 0, revenue: 0 });
      productSales[item.productId].qty += item.qty;
      productSales[item.productId].revenue += item.qty * item.price;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const topPanel = panel({ title: 'Top Products', subtitle: 'By revenue', noPad: true },
    dataTable({
      columns: [
        { label: '#', render: (_, i) => h('span', { className: 'text-gray-400 font-mono text-xs' }, String(i + 1)) },
        { label: 'Product', render: p => h('span', { className: 'font-semibold text-sm' }, p.name) },
        { label: 'Qty Sold', render: p => String(p.qty) },
        { label: 'Revenue', render: p => h('span', { className: 'font-semibold' }, currency(p.revenue)) },
      ],
      rows: topProducts,
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' },
    kpis,
    h('div', { className: 'grid grid-cols-1 xl:grid-cols-3 gap-5' },
      h('div', { className: 'xl:col-span-2' }, revenueChart),
      orderChart,
    ),
    h('div', { className: 'grid grid-cols-1 xl:grid-cols-3 gap-5' },
      h('div', { className: 'xl:col-span-2' }, topPanel),
      h('div', { className: 'space-y-5' }, categoryPanel, payPanel),
    ),
  ));
}

function barChart(data, label) {
  const max = Math.max(...data.datasets, 1);
  return h('div', {},
    h('div', { className: 'flex items-end gap-2 h-48 mt-3' },
      ...data.datasets.map((val, i) => {
        const pct = Math.round((val / max) * 100);
        return h('div', { className: 'flex-1 flex flex-col items-center gap-1' },
          h('div', { className: 'text-[10px] font-semibold text-gray-500' }, val >= 1000 ? `${(val/1000).toFixed(1)}k` : String(val)),
          h('div', {
            className: 'w-full bg-gradient-to-t from-brand-500 to-brand-400 rounded-t-lg transition-all hover:from-brand-600 hover:to-brand-500 cursor-pointer',
            style: { height: `${Math.max(pct, 4)}%` },
            title: `${data.labels[i]}: ${val}`,
          }),
          h('div', { className: 'text-[10px] text-gray-400 mt-1' }, data.labels[i]),
        );
      }),
    ),
    h('div', { className: 'text-[11px] text-gray-400 mt-3 text-center' }, label),
  );
}
