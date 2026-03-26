/* ===== Products View ===== */
import { h, mount, currency, clear } from '../utils/dom.js';
import { getState, addItem, updateItem, removeItem } from '../utils/store.js';
import { icon } from '../utils/icons.js';
import { panel, dataTable, badge, btn, formField, textInput, selectInput, openModal, toast, tabs, emptyState } from '../components/ui.js';

let _view = 'table'; // 'table' | 'grid'
let _filter = 'all';

export function renderProducts(root) {
  draw(root);
}

function draw(root) {
  const { products, categories } = getState();

  const filtered = _filter === 'all' ? products
    : _filter === 'low' ? products.filter(p => p.stock > 0 && p.stock <= 5)
    : _filter === 'out' ? products.filter(p => p.stock === 0)
    : products.filter(p => p.category === _filter);

  /* ---- Header ---- */
  const header = h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5' },
    h('div', {},
      h('h2', { className: 'text-lg font-bold text-gray-900' }, 'Products'),
      h('p', { className: 'text-xs text-gray-500 mt-0.5' }, `${products.length} total products · ${products.filter(p=>p.stock===0).length} out of stock`),
    ),
    h('div', { className: 'flex items-center gap-2' },
      btn(_view === 'table' ? 'Grid' : 'Table', { size: 'sm', ic: _view === 'table' ? 'grid' : 'list', onClick: () => { _view = _view === 'table' ? 'grid' : 'table'; draw(root); } }),
      btn('Add Product', { variant: 'primary', size: 'sm', ic: 'plus', onClick: () => openProductForm(null, root) }),
    ),
  );

  /* ---- Category filter tabs ---- */
  const filterItems = [
    { id: 'all', label: 'All' },
    { id: 'low', label: 'Low Stock' },
    { id: 'out', label: 'Out of Stock' },
    ...categories.map(c => ({ id: c, label: c })),
  ];

  const filterRow = h('div', { className: 'flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-gray-100 scrollbar-thin' },
    ...filterItems.map(f =>
      h('button', {
        className: `px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${f.id === _filter ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`,
        onClick: () => { _filter = f.id; draw(root); },
      }, f.label)
    )
  );

  /* ---- Table view ---- */
  const tableView = panel({ noPad: true },
    dataTable({
      columns: [
        { label: '', render: p => h('img', { src: p.image, alt: p.name, className: 'w-10 h-10 rounded-lg object-cover border border-gray-100', loading: 'lazy' }), className: 'w-14' },
        { label: 'Product', render: p => h('div', {},
          h('div', { className: 'font-semibold text-gray-900 text-sm' }, p.name),
          h('div', { className: 'text-[11px] text-gray-500' }, `${p.sku} · ${p.category}`),
        )},
        { label: 'Price', render: p => h('span', { className: 'font-semibold' }, currency(p.price)) },
        { label: 'Stock', render: p => {
          if (p.stock === 0) return badge('Out of Stock', 'danger');
          if (p.stock <= 5) return badge(`${p.stock} left`, 'orange');
          return h('span', { className: 'text-gray-700' }, String(p.stock));
        }},
        { label: 'Status', render: p => {
          const m = { active: 'success', inactive: 'danger', restricted: 'warning' };
          return badge(p.status, m[p.status] || 'default');
        }},
        { label: 'Tags', render: p => h('div', { className: 'flex flex-wrap gap-1' }, ...(p.tags || []).map(t => badge(t, 'brand'))) },
        { label: '', render: p => h('div', { className: 'flex items-center gap-1' },
          btn('', { size: 'sm', ic: 'edit', variant: 'ghost', onClick: (e) => { e.stopPropagation(); openProductForm(p, root); } }),
          btn('', { size: 'sm', ic: 'trash', variant: 'ghost', className: 'text-red-500 hover:!bg-red-50', onClick: (e) => { e.stopPropagation(); confirmDelete(p, root); } }),
        ), className: 'w-24' },
      ],
      rows: filtered,
      emptyMsg: 'No products match the filter',
    }),
  );

  /* ---- Grid view ---- */
  const gridView = h('div', { className: 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4' },
    ...filtered.map(p =>
      h('div', { className: 'bg-white border border-gray-200/70 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group' },
        h('div', { className: 'aspect-square bg-gray-50 flex items-center justify-center overflow-hidden' },
          h('img', { src: p.image, alt: p.name, className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300', loading: 'lazy' }),
        ),
        h('div', { className: 'p-4' },
          h('div', { className: 'text-sm font-bold text-gray-900 truncate' }, p.name),
          h('div', { className: 'text-xs text-gray-500 mt-0.5' }, p.category),
          h('div', { className: 'flex items-center justify-between mt-3' },
            h('span', { className: 'text-sm font-bold text-brand-600' }, currency(p.price)),
            p.stock === 0 ? badge('Out', 'danger') : p.stock <= 5 ? badge(`${p.stock}`, 'orange') : badge(`${p.stock}`, 'success'),
          ),
          h('div', { className: 'flex items-center gap-2 mt-3 pt-3 border-t border-gray-100' },
            btn('Edit', { size: 'sm', ic: 'edit', className: 'flex-1', onClick: () => openProductForm(p, root) }),
            btn('', { size: 'sm', ic: 'trash', variant: 'ghost', className: 'text-red-500 hover:!bg-red-50', onClick: () => confirmDelete(p, root) }),
          ),
        ),
      )
    ),
    !filtered.length ? emptyState('No products found', 'products') : null,
  );

  mount(root, h('div', { className: 'view-enter' }, header, filterRow, _view === 'table' ? tableView : gridView));
}

/* ---- Product Add/Edit modal ---- */
function openProductForm(product, root) {
  const isEdit = product != null;
  const { categories } = getState();

  const nameIn = textInput({ value: product?.name || '', placeholder: 'Product name' });
  const catIn = selectInput(['', ...categories], { value: product?.category || '' });
  const priceIn = textInput({ type: 'number', min: '0', step: '1', value: product?.price ?? '', placeholder: '0' });
  const stockIn = textInput({ type: 'number', min: '0', step: '1', value: product?.stock ?? '', placeholder: '0' });
  const skuIn = textInput({ value: product?.sku || '', placeholder: 'SKU-001' });
  const imageIn = textInput({ type: 'url', value: product?.image || '', placeholder: 'https://...' });
  const tagsIn = textInput({ value: (product?.tags || []).join(', '), placeholder: 'fresh, popular' });
  const statusIn = selectInput(['active', 'inactive', 'restricted'], { value: product?.status || 'active' });

  const body = h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
    formField('Product Name', nameIn),
    formField('Category', catIn),
    formField('Price (₹)', priceIn),
    formField('Stock', stockIn),
    formField('SKU', skuIn),
    formField('Status', statusIn),
    h('div', { className: 'md:col-span-2' }, formField('Image URL', imageIn)),
    h('div', { className: 'md:col-span-2' }, formField('Tags (comma separated)', tagsIn, { helpText: 'e.g. fresh, popular, staple' })),
  );

  const close = openModal({
    title: isEdit ? `Edit: ${product.name}` : 'Add New Product',
    body,
    width: 'max-w-2xl',
    footer: [
      btn('Cancel', { onClick: () => close() }),
      btn(isEdit ? 'Update' : 'Add Product', {
        variant: 'primary',
        onClick: () => {
          const payload = {
            name: nameIn.value.trim(),
            category: catIn.value,
            price: Number(priceIn.value) || 0,
            stock: Number(stockIn.value) || 0,
            sku: skuIn.value.trim(),
            image: imageIn.value.trim() || 'https://via.placeholder.com/120',
            tags: tagsIn.value.split(',').map(t => t.trim()).filter(Boolean),
            status: statusIn.value,
          };
          if (!payload.name) { toast('Product name is required', 'error'); return; }
          if (isEdit) {
            updateItem('products', product.id, payload);
            toast('Product updated', 'success');
          } else {
            payload.createdAt = new Date().toISOString().slice(0, 10);
            addItem('products', payload);
            toast('Product added', 'success');
          }
          close();
          draw(root);
        },
      }),
    ],
  });
}

/* ---- Delete confirm ---- */
function confirmDelete(product, root) {
  const close = openModal({
    title: 'Delete Product',
    body: h('p', { className: 'text-sm text-gray-600' }, `Are you sure you want to delete `, h('strong', {}, product.name), `? This action cannot be undone.`),
    footer: [
      btn('Cancel', { onClick: () => close() }),
      btn('Delete', { variant: 'danger', ic: 'trash', onClick: () => {
        removeItem('products', product.id);
        toast('Product deleted', 'error');
        close();
        draw(root);
      }}),
    ],
  });
}
