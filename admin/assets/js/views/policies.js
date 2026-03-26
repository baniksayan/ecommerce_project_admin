/* ===== Policies View (Privacy, Terms, Cancellation, Age Restriction) ===== */
import { h, mount } from '../utils/dom.js';
import { getState } from '../utils/store.js';
import { panel, btn, tabs } from '../components/ui.js';
import { icon } from '../utils/icons.js';

let _activeTab = 'privacy';

export function renderPolicies(root) {
  draw(root);
}

function draw(root) {
  const { policiesContent } = getState();

  const tabItems = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'cancellation', label: 'Cancellation & Refund' },
    { id: 'ageRestriction', label: 'Age Restriction' },
  ];

  const tabRow = tabs(tabItems, _activeTab, (id) => { _activeTab = id; draw(root); });

  const content = panel({
    title: tabItems.find(t => t.id === _activeTab)?.label || 'Policy',
    subtitle: 'Manage app policies displayed to users',
    actions: [
      btn('Edit', { size: 'sm', ic: 'edit' }),
      btn('Preview', { size: 'sm', ic: 'eye' }),
    ],
  },
    h('div', { className: 'prose prose-sm max-w-none', html: policiesContent[_activeTab] || '<p class="text-gray-400">No content available</p>' }),
  );

  const infoCards = h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
    infoCard('Privacy Policy', 'Controls what personal data is collected and how it is used.', 'auth'),
    infoCard('Terms & Conditions', 'Legal agreement between the app and its users.', 'policy'),
    infoCard('Cancellation Policy', 'Rules for order cancellation and refund processing.', 'orders'),
    infoCard('Age Restriction', 'Verification requirements for restricted product categories.', 'tobacco'),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, tabRow, content, infoCards));
}

function infoCard(title, desc, ic) {
  return h('div', { className: 'flex items-start gap-4 p-4 bg-white border border-gray-200/70 rounded-2xl shadow-sm' },
    h('div', { className: 'w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center flex-shrink-0', html: icon(ic, 'w-5 h-5') }),
    h('div', {},
      h('h4', { className: 'text-sm font-bold text-gray-900' }, title),
      h('p', { className: 'text-xs text-gray-500 mt-0.5' }, desc),
    ),
  );
}
