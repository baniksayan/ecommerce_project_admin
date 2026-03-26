/* ===== Addresses View ===== */
import { h, mount } from '../utils/dom.js';
import { getState, addItem, updateItem, removeItem } from '../utils/store.js';
import { icon } from '../utils/icons.js';
import { panel, dataTable, badge, btn, formField, textInput, selectInput, openModal, toast, metricCard } from '../components/ui.js';

export function renderAddresses(root) {
  draw(root);
}

function draw(root) {
  const { addresses, users } = getState();

  const kpis = h('div', { className: 'grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5' },
    metricCard({ label: 'Total Addresses', value: addresses.length, icon: 'addresses', color: 'brand' }),
    metricCard({ label: 'Default Addresses', value: addresses.filter(a => a.isDefault).length, icon: 'check', color: 'green' }),
    metricCard({ label: 'Users with Address', value: new Set(addresses.map(a => a.userId)).size, icon: 'users', color: 'blue' }),
  );

  const table = panel({ title: 'All Addresses', subtitle: `${addresses.length} saved`, actions: [
    btn('Add Address', { size: 'sm', variant: 'primary', ic: 'plus', onClick: () => openAddressForm(null, root) }),
  ], noPad: true },
    dataTable({
      columns: [
        { label: 'User', render: a => {
          const u = users.find(u => u.id === a.userId);
          return h('span', { className: 'font-semibold text-sm' }, u?.name || `User #${a.userId}`);
        }},
        { label: 'Label', render: a => badge(a.label, 'brand') },
        { label: 'Address', render: a => h('div', { className: 'text-sm text-gray-600' },
          `${a.line1}${a.line2 ? ', ' + a.line2 : ''}, ${a.city}`,
        )},
        { label: 'PIN', key: 'pin' },
        { label: 'State', key: 'state' },
        { label: 'Default', render: a => a.isDefault ? badge('Default', 'success') : h('span', { className: 'text-gray-400 text-xs' }, '—') },
        { label: '', render: a => h('div', { className: 'flex items-center gap-1' },
          btn('', { size: 'sm', ic: 'edit', variant: 'ghost', onClick: (e) => { e.stopPropagation(); openAddressForm(a, root); } }),
          btn('', { size: 'sm', ic: 'trash', variant: 'ghost', className: 'text-red-500', onClick: (e) => { e.stopPropagation(); removeItem('addresses', a.id); toast('Address deleted', 'error'); draw(root); } }),
        ), className: 'w-24' },
      ],
      rows: addresses,
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, kpis, table));
}

function openAddressForm(addr, root) {
  const isEdit = addr != null;
  const { users } = getState();

  const userIn = selectInput([{ value: '', label: 'Select user' }, ...users.map(u => ({ value: String(u.id), label: u.name }))], { value: addr ? String(addr.userId) : '' });
  const labelIn = textInput({ value: addr?.label || '', placeholder: 'Home / Office' });
  const line1In = textInput({ value: addr?.line1 || '', placeholder: 'Street address' });
  const line2In = textInput({ value: addr?.line2 || '', placeholder: 'Landmark (optional)' });
  const cityIn = textInput({ value: addr?.city || '', placeholder: 'City' });
  const stateIn = textInput({ value: addr?.state || '', placeholder: 'State' });
  const pinIn = textInput({ value: addr?.pin || '', placeholder: 'PIN code' });

  const body = h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
    formField('User', userIn),
    formField('Label', labelIn),
    h('div', { className: 'md:col-span-2' }, formField('Address Line 1', line1In)),
    h('div', { className: 'md:col-span-2' }, formField('Address Line 2', line2In)),
    formField('City', cityIn),
    formField('State', stateIn),
    formField('PIN', pinIn),
  );

  const close = openModal({
    title: isEdit ? 'Edit Address' : 'Add Address',
    body, width: 'max-w-2xl',
    footer: [
      btn('Cancel', { onClick: () => close() }),
      btn(isEdit ? 'Update' : 'Save', { variant: 'primary', onClick: () => {
        const payload = {
          userId: Number(userIn.value),
          label: labelIn.value.trim() || 'Home',
          line1: line1In.value.trim(),
          line2: line2In.value.trim(),
          city: cityIn.value.trim(),
          state: stateIn.value.trim(),
          pin: pinIn.value.trim(),
          isDefault: addr?.isDefault || false,
        };
        if (!payload.userId || !payload.line1) { toast('User and address required', 'error'); return; }
        if (isEdit) { updateItem('addresses', addr.id, payload); toast('Address updated', 'success'); }
        else { addItem('addresses', payload); toast('Address added', 'success'); }
        close(); draw(root);
      }}),
    ],
  });
}
