/* ===== Inventory View ===== */
import { h, mount, currency } from '../utils/dom.js';
import { getState, updateItem } from '../utils/store.js';
import { icon } from '../utils/icons.js';
import { panel, dataTable, badge, btn, metricCard, textInput, openModal, toast } from '../components/ui.js';

export function renderInventory(root) {
  draw(root);
}

function draw(root) {
  const { products } = getState();

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter(p => p.stock === 0);
  const healthy = products.filter(p => p.stock > 5);

  const kpis = h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5' },
    metricCard({ label: 'Total Stock Units', value: totalStock.toLocaleString(), icon: 'inventory', color: 'brand' }),
    metricCard({ label: 'Healthy Stock', value: healthy.length, icon: 'check', color: 'green' }),
    metricCard({ label: 'Low Stock', value: lowStock.length, icon: 'tobacco', color: 'orange' }),
    metricCard({ label: 'Out of Stock', value: outOfStock.length, icon: 'x', color: 'red' }),
  );

  /* ---- Low stock alerts ---- */
  const alertPanel = panel({ title: 'Low Stock Alerts', subtitle: `${lowStock.length} items need attention`, noPad: true },
    lowStock.length ? dataTable({
      columns: [
        { label: '', render: p => h('img', { src: p.image, className: 'w-9 h-9 rounded-lg object-cover border border-gray-100', loading: 'lazy' }), className: 'w-14' },
        { label: 'Product', render: p => h('div', {}, h('div', { className: 'font-semibold text-sm' }, p.name), h('div', { className: 'text-[11px] text-gray-500' }, p.sku)) },
        { label: 'Category', key: 'category' },
        { label: 'Stock', render: p => badge(`${p.stock} units`, 'orange') },
        { label: '', render: p => btn('Restock', { size: 'sm', variant: 'primary', ic: 'plus', onClick: (e) => { e.stopPropagation(); openRestock(p, root); } }), className: 'w-28' },
      ],
      rows: lowStock,
    }) : h('div', { className: 'p-8 text-center text-sm text-gray-400' }, 'All stock levels healthy!'),
  );

  /* ---- Out of stock ---- */
  const outPanel = panel({ title: 'Out of Stock', subtitle: `${outOfStock.length} products unavailable`, noPad: true },
    outOfStock.length ? dataTable({
      columns: [
        { label: '', render: p => h('img', { src: p.image, className: 'w-9 h-9 rounded-lg object-cover border border-gray-100', loading: 'lazy' }), className: 'w-14' },
        { label: 'Product', render: p => h('div', {}, h('div', { className: 'font-semibold text-sm' }, p.name)) },
        { label: 'SKU', key: 'sku' },
        { label: 'Status', render: () => badge('Out of Stock', 'danger') },
        { label: '', render: p => btn('Restock', { size: 'sm', variant: 'primary', ic: 'plus', onClick: (e) => { e.stopPropagation(); openRestock(p, root); } }), className: 'w-28' },
      ],
      rows: outOfStock,
    }) : h('div', { className: 'p-8 text-center text-sm text-gray-400' }, 'No out-of-stock items'),
  );

  /* ---- Full stock table ---- */
  const fullTable = panel({ title: 'Full Inventory', subtitle: `${products.length} products`, noPad: true },
    dataTable({
      columns: [
        { label: '', render: p => h('img', { src: p.image, className: 'w-9 h-9 rounded-lg object-cover border border-gray-100', loading: 'lazy' }), className: 'w-14' },
        { label: 'Product', render: p => h('div', {}, h('div', { className: 'font-semibold text-sm' }, p.name), h('div', { className: 'text-[11px] text-gray-500' }, `${p.sku} · ${p.category}`)) },
        { label: 'Price', render: p => currency(p.price) },
        { label: 'Stock', render: p => {
          if (p.stock === 0) return badge('0', 'danger');
          if (p.stock <= 5) return badge(String(p.stock), 'orange');
          return h('span', { className: 'font-medium' }, String(p.stock));
        }},
        { label: '', render: p => btn('Update', { size: 'sm', variant: 'ghost', ic: 'edit', onClick: (e) => { e.stopPropagation(); openRestock(p, root); } }) },
      ],
      rows: products,
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, kpis, h('div', { className: 'grid grid-cols-1 xl:grid-cols-2 gap-5' }, alertPanel, outPanel), fullTable));
}

function openRestock(product, root) {
  const stockIn = textInput({ type: 'number', min: '0', value: '', placeholder: 'Enter new stock quantity' });

  const close = openModal({
    title: `Restock: ${product.name}`,
    body: [
      h('p', { className: 'text-sm text-gray-600 mb-3' }, `Current stock: ${product.stock} units`),
      h('div', { className: 'space-y-1.5' },
        h('label', { className: 'block text-xs font-semibold text-gray-700' }, 'New Stock Quantity'),
        stockIn,
      ),
    ],
    footer: [
      btn('Cancel', { onClick: () => close() }),
      btn('Update Stock', { variant: 'primary', onClick: () => {
        const val = Number(stockIn.value);
        if (isNaN(val) || val < 0) { toast('Enter a valid number', 'error'); return; }
        updateItem('products', product.id, { stock: val, status: val > 0 ? 'active' : product.status });
        toast(`${product.name} stock → ${val}`, 'success');
        close();
        draw(root);
      }}),
    ],
  });
}
