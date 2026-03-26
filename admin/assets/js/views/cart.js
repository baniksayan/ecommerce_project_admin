/* ===== Cart View ===== */
import { h, mount, currency } from '../utils/dom.js';
import { getState, removeItem, updateItem } from '../utils/store.js';
import { panel, dataTable, badge, btn, toast, metricCard } from '../components/ui.js';

export function renderCart(root) {
  draw(root);
}

function draw(root) {
  const { cartItems, users } = getState();

  const totalValue = cartItems.reduce((s, c) => s + (c.qty * c.price), 0);

  const kpis = h('div', { className: 'grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5' },
    metricCard({ label: 'Active Carts', value: new Set(cartItems.map(c => c.userId)).size, icon: 'cart', color: 'brand' }),
    metricCard({ label: 'Cart Items', value: cartItems.length, icon: 'products', color: 'blue' }),
    metricCard({ label: 'Cart Value', value: currency(totalValue), icon: 'analytics', color: 'green' }),
  );

  const table = panel({ title: 'Active Cart Items', subtitle: 'Across all users', noPad: true },
    dataTable({
      columns: [
        { label: 'User', render: c => {
          const u = users.find(u => u.id === c.userId);
          return h('span', { className: 'font-semibold text-sm' }, u?.name || `User #${c.userId}`);
        }},
        { label: 'Product', render: c => h('span', { className: 'font-medium' }, c.productName) },
        { label: 'Qty', render: c => h('span', { className: 'font-semibold' }, String(c.qty)) },
        { label: 'Price', render: c => currency(c.price) },
        { label: 'Subtotal', render: c => h('span', { className: 'font-semibold' }, currency(c.qty * c.price)) },
        { label: '', render: c => btn('', { size: 'sm', ic: 'trash', variant: 'ghost', className: 'text-red-500', onClick: (e) => {
          e.stopPropagation();
          removeItem('cartItems', c.id);
          toast('Cart item removed', 'info');
          draw(root);
        }}), className: 'w-14' },
      ],
      rows: cartItems,
      emptyMsg: 'No active cart items',
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, kpis, table));
}
