/* ===== Users View ===== */
import { h, mount, currency, timeAgo, formatDate } from '../utils/dom.js';
import { getState, updateItem } from '../utils/store.js';
import { icon } from '../utils/icons.js';
import { panel, dataTable, badge, btn, openModal, toast, metricCard } from '../components/ui.js';

export function renderUsers(root) {
  const { users, orders, addresses } = getState();

  const kpis = h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5' },
    metricCard({ label: 'Total Users', value: users.length, icon: 'users', color: 'brand' }),
    metricCard({ label: 'Active', value: users.filter(u => u.status === 'active').length, icon: 'check', color: 'green' }),
    metricCard({ label: 'Blocked', value: users.filter(u => u.status === 'blocked').length, icon: 'x', color: 'red' }),
    metricCard({ label: 'Total Spent', value: currency(users.reduce((s, u) => s + u.spent, 0)), icon: 'analytics', color: 'blue' }),
  );

  const table = panel({ title: 'All Users', subtitle: `${users.length} registered`, noPad: true },
    dataTable({
      columns: [
        { label: '', render: u => h('div', { className: 'w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center text-white text-xs font-bold' }, u.name[0]), className: 'w-14' },
        { label: 'User', render: u => h('div', {},
          h('div', { className: 'font-semibold text-gray-900 text-sm' }, u.name),
          h('div', { className: 'text-[11px] text-gray-500' }, u.email),
        )},
        { label: 'Phone', key: 'phone' },
        { label: 'Orders', render: u => h('span', { className: 'font-semibold' }, String(u.orders)) },
        { label: 'Spent', render: u => h('span', { className: 'font-semibold' }, currency(u.spent)) },
        { label: 'Status', render: u => badge(u.status === 'active' ? 'Active' : 'Blocked', u.status === 'active' ? 'success' : 'danger') },
        { label: 'Last Active', render: u => h('span', { className: 'text-xs text-gray-500' }, timeAgo(u.lastActive)) },
        { label: '', render: u => h('div', { className: 'flex items-center gap-1' },
          btn('', { size: 'sm', ic: 'eye', variant: 'ghost', onClick: (e) => { e.stopPropagation(); showUserDetail(root, u); } }),
          btn(u.status === 'active' ? '' : '', {
            size: 'sm',
            ic: u.status === 'active' ? 'x' : 'check',
            variant: 'ghost',
            className: u.status === 'active' ? 'text-red-500 hover:!bg-red-50' : 'text-green-600 hover:!bg-green-50',
            onClick: (e) => {
              e.stopPropagation();
              const next = u.status === 'active' ? 'blocked' : 'active';
              updateItem('users', u.id, { status: next });
              toast(`${u.name} → ${next}`, next === 'active' ? 'success' : 'warning');
              renderUsers(root);
            },
          }),
        ), className: 'w-24' },
      ],
      rows: users,
      onRowClick: u => showUserDetail(root, u),
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, kpis, table));
}

function showUserDetail(root, user) {
  const { orders, addresses } = getState();
  const userOrders = orders.filter(o => o.customerId === user.id);
  const userAddresses = addresses.filter(a => a.userId === user.id);

  const close = openModal({
    title: user.name,
    width: 'max-w-2xl',
    body: [
      h('div', { className: 'grid grid-cols-2 gap-4 text-sm mb-5' },
        detail('Email', user.email),
        detail('Phone', user.phone),
        detail('Status', user.status),
        detail('Joined', formatDate(user.joinedAt)),
        detail('Total Orders', String(user.orders)),
        detail('Total Spent', currency(user.spent)),
        detail('Last Active', timeAgo(user.lastActive)),
        detail('Addresses', String(userAddresses.length)),
      ),
      userOrders.length ? h('div', {},
        h('h4', { className: 'text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2' }, 'Order History'),
        h('div', { className: 'space-y-2' },
          ...userOrders.map(o =>
            h('div', { className: 'flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm' },
              h('span', { className: 'font-semibold' }, o.id),
              h('span', {}, currency(o.total)),
              badge(o.status, o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'danger' : 'warning'),
              h('span', { className: 'text-xs text-gray-500' }, formatDate(o.date)),
            )
          )
        )
      ) : null,
    ],
    footer: [btn('Close', { onClick: () => close() })],
  });
}

function detail(label, value) {
  return h('div', {},
    h('div', { className: 'text-[11px] text-gray-500 font-semibold uppercase tracking-wider' }, label),
    h('div', { className: 'text-gray-800 mt-0.5 font-medium' }, value),
  );
}
