/* ===== Checkout View ===== */
import { h, mount, currency, formatDate } from '../utils/dom.js';
import { getState } from '../utils/store.js';
import { panel, dataTable, badge, metricCard } from '../components/ui.js';

export function renderCheckout(root) {
  const { checkouts, users } = getState();

  const completed = checkouts.filter(c => c.paymentStatus === 'completed');
  const pending = checkouts.filter(c => c.paymentStatus === 'pending');
  const totalCollected = completed.reduce((s, c) => s + c.amount, 0);

  const kpis = h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5' },
    metricCard({ label: 'Total Checkouts', value: checkouts.length, icon: 'checkout', color: 'brand' }),
    metricCard({ label: 'Completed', value: completed.length, icon: 'check', color: 'green' }),
    metricCard({ label: 'Pending', value: pending.length, icon: 'orders', color: 'orange' }),
    metricCard({ label: 'Collected', value: currency(totalCollected), icon: 'analytics', color: 'blue' }),
  );

  const table = panel({ title: 'Checkout Transactions', noPad: true },
    dataTable({
      columns: [
        { label: 'Order', render: c => h('span', { className: 'font-semibold' }, c.orderId) },
        { label: 'User', render: c => {
          const u = users.find(u => u.id === c.userId);
          return h('span', {}, u?.name || `User #${c.userId}`);
        }},
        { label: 'Method', render: c => badge(c.paymentMethod, 'brand') },
        { label: 'Amount', render: c => h('span', { className: 'font-semibold' }, currency(c.amount)) },
        { label: 'Status', render: c => badge(c.paymentStatus === 'completed' ? 'Completed' : 'Pending', c.paymentStatus === 'completed' ? 'success' : 'warning') },
        { label: 'Date', render: c => h('span', { className: 'text-xs text-gray-500' }, formatDate(c.date)) },
      ],
      rows: checkouts,
      emptyMsg: 'No checkout data',
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, kpis, table));
}
