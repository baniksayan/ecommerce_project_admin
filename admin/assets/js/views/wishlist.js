/* ===== Wishlist View ===== */
import { h, mount, currency, formatDate } from '../utils/dom.js';
import { getState, removeItem } from '../utils/store.js';
import { panel, dataTable, badge, btn, toast, metricCard } from '../components/ui.js';

export function renderWishlist(root) {
  const { wishlistItems, users, products } = getState();

  const kpis = h('div', { className: 'grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5' },
    metricCard({ label: 'Wishlist Items', value: wishlistItems.length, icon: 'wishlist', color: 'brand' }),
    metricCard({ label: 'Users with Wishlist', value: new Set(wishlistItems.map(w => w.userId)).size, icon: 'users', color: 'purple' }),
    metricCard({ label: 'Wishlist Value', value: currency(wishlistItems.reduce((s, w) => s + w.price, 0)), icon: 'analytics', color: 'green' }),
  );

  const table = panel({ title: 'All Wishlist Items', noPad: true },
    dataTable({
      columns: [
        { label: 'User', render: w => {
          const u = users.find(u => u.id === w.userId);
          return h('span', { className: 'font-semibold text-sm' }, u?.name || `User #${w.userId}`);
        }},
        { label: 'Product', render: w => h('span', { className: 'font-medium' }, w.productName) },
        { label: 'Price', render: w => h('span', { className: 'font-semibold' }, currency(w.price)) },
        { label: 'Added', render: w => h('span', { className: 'text-xs text-gray-500' }, formatDate(w.addedAt)) },
        { label: 'In Stock', render: w => {
          const p = products.find(p => p.id === w.productId);
          if (!p) return badge('N/A', 'default');
          return p.stock > 0 ? badge('Yes', 'success') : badge('No', 'danger');
        }},
        { label: '', render: w => btn('', { size: 'sm', ic: 'trash', variant: 'ghost', className: 'text-red-500', onClick: (e) => {
          e.stopPropagation();
          removeItem('wishlistItems', w.id);
          toast('Wishlist item removed', 'info');
          renderWishlist(root);
        }}), className: 'w-14' },
      ],
      rows: wishlistItems,
      emptyMsg: 'No wishlist items',
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, kpis, table));
}
