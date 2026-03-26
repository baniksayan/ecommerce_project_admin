/* ===== Reviews View ===== */
import { h, mount, formatDate } from '../utils/dom.js';
import { getState, updateItem } from '../utils/store.js';
import { panel, dataTable, badge, btn, stars, toast, metricCard } from '../components/ui.js';

let _filter = 'all';

export function renderReviews(root) {
  draw(root);
}

function draw(root) {
  const { reviews } = getState();
  const filtered = _filter === 'all' ? reviews : reviews.filter(r => r.status === _filter);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';

  const kpis = h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5' },
    metricCard({ label: 'Total Reviews', value: reviews.length, icon: 'reviews', color: 'brand' }),
    metricCard({ label: 'Avg Rating', value: `${avg} ★`, icon: 'reviews', color: 'green' }),
    metricCard({ label: 'Pending', value: reviews.filter(r => r.status === 'pending').length, icon: 'orders', color: 'orange' }),
    metricCard({ label: 'Flagged', value: reviews.filter(r => r.status === 'flagged').length, icon: 'tobacco', color: 'red' }),
  );

  const tabs = h('div', { className: 'flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-gray-100' },
    ...['all', 'pending', 'approved', 'flagged'].map(f =>
      h('button', {
        className: `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${f === _filter ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
        onClick: () => { _filter = f; draw(root); },
      }, `${f[0].toUpperCase() + f.slice(1)} (${f === 'all' ? reviews.length : reviews.filter(r => r.status === f).length})`)
    ),
  );

  const table = panel({ title: 'Reviews', noPad: true },
    dataTable({
      columns: [
        { label: 'Product', render: r => h('span', { className: 'font-semibold text-sm' }, r.productName) },
        { label: 'User', key: 'userName' },
        { label: 'Rating', render: r => stars(r.rating) },
        { label: 'Comment', render: r => h('span', { className: 'text-sm text-gray-600 max-w-[200px] truncate block' }, r.comment) },
        { label: 'Date', render: r => h('span', { className: 'text-xs text-gray-500' }, formatDate(r.date)) },
        { label: 'Status', render: r => {
          const m = { approved: 'success', pending: 'warning', flagged: 'danger' };
          return badge(r.status, m[r.status] || 'default');
        }},
        { label: '', render: r => h('div', { className: 'flex items-center gap-1' },
          r.status !== 'approved' ? btn('', { size: 'sm', ic: 'check', variant: 'ghost', className: 'text-green-600', onClick: (e) => { e.stopPropagation(); updateItem('reviews', r.id, { status: 'approved' }); toast('Review approved', 'success'); draw(root); } }) : null,
          r.status !== 'flagged' ? btn('', { size: 'sm', ic: 'tobacco', variant: 'ghost', className: 'text-red-500', onClick: (e) => { e.stopPropagation(); updateItem('reviews', r.id, { status: 'flagged' }); toast('Review flagged', 'warning'); draw(root); } }) : null,
        ), className: 'w-24' },
      ],
      rows: filtered,
      emptyMsg: 'No reviews found',
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, kpis, tabs, table));
}
