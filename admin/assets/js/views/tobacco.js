/* ===== Tobacco / Age Verification View ===== */
import { h, mount, formatDate } from '../utils/dom.js';
import { getState } from '../utils/store.js';
import { icon } from '../utils/icons.js';
import { panel, btn, badge, dataTable, toggle, toast, metricCard } from '../components/ui.js';

let tobaccoConfig = {
  ageVerificationEnabled: true,
  minAge: 18,
  requireIdProof: true,
  deliveryAgentCheck: true,
};

const verificationLog = [
  { id: 1, user: 'Sayan Banik', product: 'Classic Cigarette', verified: true, method: 'Aadhaar', date: '2026-03-20' },
  { id: 2, user: 'Rahul Sen', product: 'Classic Cigarette', verified: false, method: 'Declined', date: '2026-03-22' },
];

export function renderTobacco(root) {
  const { products } = getState();
  const tobaccoProducts = products.filter(p => p.category === 'Tobacco' || (p.tags || []).includes('tobacco'));

  const kpis = h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5' },
    metricCard({ label: 'Restricted Products', value: tobaccoProducts.length, icon: 'tobacco', color: 'orange' }),
    metricCard({ label: 'Verifications', value: verificationLog.length, icon: 'auth', color: 'blue' }),
    metricCard({ label: 'Verified', value: verificationLog.filter(v => v.verified).length, icon: 'check', color: 'green' }),
    metricCard({ label: 'Declined', value: verificationLog.filter(v => !v.verified).length, icon: 'x', color: 'red' }),
  );

  const settingsPanel = panel({ title: 'Age Verification Settings', subtitle: 'Configure tobacco purchase restrictions' },
    h('div', { className: 'space-y-5' },
      settingRow('Age Verification', 'Require age check before purchase', tobaccoConfig.ageVerificationEnabled, v => { tobaccoConfig.ageVerificationEnabled = v; renderTobacco(root); }),
      settingRow('Require ID Proof', 'Ask for government-issued ID', tobaccoConfig.requireIdProof, v => { tobaccoConfig.requireIdProof = v; renderTobacco(root); }),
      settingRow('Delivery Agent Check', 'Agent verifies age at delivery', tobaccoConfig.deliveryAgentCheck, v => { tobaccoConfig.deliveryAgentCheck = v; renderTobacco(root); }),
    ),
  );

  const productsPanel = panel({ title: 'Restricted Products', noPad: true },
    dataTable({
      columns: [
        { label: '', render: p => h('img', { src: p.image, className: 'w-9 h-9 rounded-lg object-cover border border-gray-100', loading: 'lazy' }), className: 'w-14' },
        { label: 'Product', render: p => h('span', { className: 'font-semibold text-sm' }, p.name) },
        { label: 'Price', render: p => `₹${p.price}` },
        { label: 'Stock', render: p => String(p.stock) },
        { label: 'Status', render: p => badge('Restricted', 'warning') },
      ],
      rows: tobaccoProducts,
      emptyMsg: 'No restricted products',
    }),
  );

  const logPanel = panel({ title: 'Verification Log', noPad: true },
    dataTable({
      columns: [
        { label: 'User', render: v => h('span', { className: 'font-semibold text-sm' }, v.user) },
        { label: 'Product', key: 'product' },
        { label: 'Method', render: v => badge(v.method, 'brand') },
        { label: 'Result', render: v => v.verified ? badge('Verified', 'success') : badge('Declined', 'danger') },
        { label: 'Date', render: v => h('span', { className: 'text-xs text-gray-500' }, formatDate(v.date)) },
      ],
      rows: verificationLog,
    }),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, kpis, 
    h('div', { className: 'grid grid-cols-1 xl:grid-cols-2 gap-5' }, settingsPanel, productsPanel),
    logPanel,
  ));
}

function settingRow(title, desc, checked, onChange) {
  return h('div', { className: 'flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100' },
    h('div', {},
      h('div', { className: 'text-sm font-semibold text-gray-800' }, title),
      h('div', { className: 'text-xs text-gray-500 mt-0.5' }, desc),
    ),
    toggle(checked, onChange),
  );
}
