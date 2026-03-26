/* ===== Orders View ===== */
import { h, mount, currency, formatDate } from '../utils/dom.js';
import { getState, updateItem } from '../utils/store.js';
import { icon } from '../utils/icons.js';
import { panel, dataTable, badge, orderBadge, btn, selectInput, openModal, toast, tabs } from '../components/ui.js';

const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];
let _tab = 'all';

export function renderOrders(root, _route, query) {
  if (query?.id) {
    showOrderDetail(root, query.id);
    return;
  }
  draw(root);
}

function draw(root) {
  const { orders } = getState();
  const filtered = _tab === 'all' ? orders : orders.filter(o => o.status === _tab);

  const kpis = h('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-3 mb-5' },
    kpi('Total', orders.length, 'blue'),
    kpi('Pending', orders.filter(o => o.status === 'pending').length, 'orange'),
    kpi('Shipped', orders.filter(o => o.status === 'shipped').length, 'info'),
    kpi('Delivered', orders.filter(o => o.status === 'delivered').length, 'green'),
  );

  const tabItems = [
    { id: 'all', label: `All (${orders.length})` },
    ...STATUSES.map(s => ({ id: s, label: `${s[0].toUpperCase() + s.slice(1)} (${orders.filter(o => o.status === s).length})` })),
  ];

  const header = h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4' },
    h('div', {},
      h('h2', { className: 'text-lg font-bold text-gray-900' }, 'Orders'),
      h('p', { className: 'text-xs text-gray-500 mt-0.5' }, `${orders.length} orders · ${currency(orders.reduce((s,o)=>s+o.total,0))} total value`),
    ),
    h('div', { className: 'flex items-center gap-2' },
      btn('Export', { size: 'sm', ic: 'download' }),
      btn('Refresh', { size: 'sm', ic: 'refresh', onClick: () => draw(root) }),
    ),
  );

  const filterTabs = h('div', { className: 'flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-gray-100' },
    ...tabItems.map(t =>
      h('button', {
        className: `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${t.id === _tab ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
        onClick: () => { _tab = t.id; draw(root); },
      }, t.label)
    ),
  );

  const table = panel({ noPad: true },
    dataTable({
      columns: [
        { label: 'Order', render: o => h('span', { className: 'font-semibold text-gray-900' }, o.id) },
        { label: 'Customer', render: o => h('div', {}, h('div', { className: 'font-medium text-sm' }, o.customerName), h('div', { className: 'text-[11px] text-gray-500' }, o.email)) },
        { label: 'Items', render: o => h('span', { className: 'text-gray-600' }, `${o.items.length} item${o.items.length > 1 ? 's' : ''}`) },
        { label: 'Amount', render: o => h('span', { className: 'font-semibold' }, currency(o.total)) },
        { label: 'Payment', render: o => badge(o.paymentMethod, 'brand') },
        { label: 'Status', render: o => orderBadge(o.status) },
        { label: 'Date', render: o => h('span', { className: 'text-gray-500 text-xs' }, formatDate(o.date)) },
        { label: '', render: o => h('div', { className: 'flex items-center gap-1' },
          btn('', { size: 'sm', ic: 'eye', variant: 'ghost', onClick: (e) => { e.stopPropagation(); window.location.hash = `#orders?id=${o.id}`; } }),
          statusDropdown(o, root),
        ), className: 'w-40' },
      ],
      rows: filtered,
      onRowClick: o => { window.location.hash = `#orders?id=${o.id}`; },
      emptyMsg: 'No orders found',
    }),
  );

  mount(root, h('div', { className: 'view-enter' }, header, kpis, filterTabs, table));
}

function statusDropdown(order, root) {
  const sel = h('select', {
    className: 'h-8 px-2 rounded-lg border border-gray-200 text-xs bg-white outline-none focus:border-brand-500',
    onClick: e => e.stopPropagation(),
    onChange: (e) => {
      updateItem('orders', order.id, { status: e.target.value });
      toast(`Order ${order.id} → ${e.target.value}`, 'success');
      // redraw after short delay
      setTimeout(() => draw(root), 200);
    },
  },
    ...STATUSES.map(s => {
      const opt = h('option', { value: s }, s[0].toUpperCase() + s.slice(1));
      if (s === order.status) opt.selected = true;
      return opt;
    }),
  );
  return sel;
}

function showOrderDetail(root, orderId) {
  const { orders } = getState();
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    mount(root, h('div', { className: 'text-center py-20 text-gray-400' }, `Order ${orderId} not found`));
    return;
  }

  const back = btn('← Back to Orders', { size: 'sm', onClick: () => { window.location.hash = '#orders'; } });

  const info = panel({ title: `Order: ${order.id}`, subtitle: formatDate(order.date), actions: [orderBadge(order.status)] },
    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 text-sm' },
      detail('Customer', order.customerName),
      detail('Email', order.email),
      detail('Payment', order.paymentMethod),
      detail('Address', order.address),
      detail('Total', currency(order.total)),
      detail('Items', `${order.items.length}`),
    ),
  );

  const itemsTable = panel({ title: 'Items', noPad: true },
    dataTable({
      columns: [
        { label: 'Product', key: 'name' },
        { label: 'Qty', render: i => String(i.qty) },
        { label: 'Price', render: i => currency(i.price) },
        { label: 'Subtotal', render: i => h('span', { className: 'font-semibold' }, currency(i.qty * i.price)) },
      ],
      rows: order.items,
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, back, info, itemsTable));
}

function detail(label, value) {
  return h('div', {},
    h('div', { className: 'text-[11px] text-gray-500 font-semibold uppercase tracking-wider' }, label),
    h('div', { className: 'text-gray-800 mt-0.5 font-medium' }, value),
  );
}

function kpi(label, count, color) {
  const bg = { blue: 'bg-blue-50 border-blue-200/60 text-blue-700', orange: 'bg-amber-50 border-amber-200/60 text-amber-700', info: 'bg-sky-50 border-sky-200/60 text-sky-700', green: 'bg-green-50 border-green-200/60 text-green-700' };
  return h('div', { className: `flex items-center gap-3 p-3 rounded-xl border ${bg[color] || ''}` },
    h('div', { className: 'text-xl font-extrabold' }, String(count)),
    h('div', { className: 'text-xs font-medium opacity-80' }, label),
  );
}
