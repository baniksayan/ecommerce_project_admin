/* ===== Contact Us View ===== */
import { h, mount, formatDate } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { panel, btn, badge, dataTable, formField, textInput, textArea, toast } from '../components/ui.js';

const contactMessages = [
  { id: 1, name: 'Sayan Banik', email: 'sayan@example.com', subject: 'Delivery delay', message: 'My order ORD-1001 is delayed by 2 days.', date: '2026-03-24', status: 'open' },
  { id: 2, name: 'Aditi Das', email: 'aditi@example.com', subject: 'Wrong item received', message: 'I received onions instead of bananas.', date: '2026-03-23', status: 'resolved' },
  { id: 3, name: 'Nina Roy', email: 'nina@example.com', subject: 'Payment issue', message: 'UPI payment deducted but order not confirmed.', date: '2026-03-25', status: 'open' },
];

export function renderContact(root) {
  const infoCards = h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-5' },
    contactCard('Email Support', 'support@mandalvariety.com', 'contact'),
    contactCard('Phone', '+91 99999 99999', 'users'),
    contactCard('Address', 'Kolkata, West Bengal, India', 'addresses'),
  );

  const msgTable = panel({ title: 'Customer Messages', subtitle: `${contactMessages.length} messages`, noPad: true },
    dataTable({
      columns: [
        { label: 'Name', render: m => h('span', { className: 'font-semibold text-sm' }, m.name) },
        { label: 'Email', key: 'email' },
        { label: 'Subject', render: m => h('span', { className: 'font-medium' }, m.subject) },
        { label: 'Message', render: m => h('span', { className: 'text-sm text-gray-600 max-w-[200px] truncate block' }, m.message) },
        { label: 'Date', render: m => h('span', { className: 'text-xs text-gray-500' }, formatDate(m.date)) },
        { label: 'Status', render: m => badge(m.status === 'open' ? 'Open' : 'Resolved', m.status === 'open' ? 'warning' : 'success') },
        { label: '', render: m => m.status === 'open' ? btn('Resolve', { size: 'sm', variant: 'success', onClick: () => { m.status = 'resolved'; toast('Marked resolved', 'success'); renderContact(root); } }) : null },
      ],
      rows: contactMessages,
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, infoCards, msgTable));
}

function contactCard(title, value, ic) {
  return h('div', { className: 'flex items-center gap-4 p-5 bg-white border border-gray-200/70 rounded-2xl shadow-sm' },
    h('div', { className: 'w-11 h-11 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center flex-shrink-0', html: icon(ic, 'w-5 h-5') }),
    h('div', {},
      h('div', { className: 'text-xs text-gray-500 font-semibold uppercase tracking-wider' }, title),
      h('div', { className: 'text-sm font-bold text-gray-900 mt-0.5' }, value),
    ),
  );
}
