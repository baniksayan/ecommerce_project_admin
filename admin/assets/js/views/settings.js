/* ===== Settings View ===== */
import { h, mount, currency } from '../utils/dom.js';
import { getState, setState } from '../utils/store.js';
import { icon } from '../utils/icons.js';
import { panel, btn, formField, textInput, selectInput, toggle, toast, tabs } from '../components/ui.js';

let _tab = 'general';

export function renderSettings(root) {
  draw(root);
}

function draw(root) {
  const settings = getState().settingsData;

  const tabItems = [
    { id: 'general', label: 'General' },
    { id: 'payment', label: 'Payments' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'delivery', label: 'Delivery' },
  ];

  const tabRow = tabs(tabItems, _tab, (id) => { _tab = id; draw(root); });

  let content;

  if (_tab === 'general') {
    const nameIn = textInput({ value: settings.general.storeName });
    const emailIn = textInput({ value: settings.general.storeEmail, type: 'email' });
    const phoneIn = textInput({ value: settings.general.phone });
    const currIn = selectInput(['INR', 'USD', 'EUR'], { value: settings.general.currency });
    const tzIn = selectInput(['Asia/Kolkata', 'UTC', 'America/New_York'], { value: settings.general.timezone });
    const langIn = selectInput(['English', 'Hindi', 'Bengali'], { value: settings.general.language });

    content = panel({ title: 'General Settings', subtitle: 'Store information & preferences' },
      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        formField('Store Name', nameIn),
        formField('Email', emailIn),
        formField('Phone', phoneIn),
        formField('Currency', currIn),
        formField('Timezone', tzIn),
        formField('Language', langIn),
      ),
      h('div', { className: 'flex justify-end mt-5' },
        btn('Save Changes', { variant: 'primary', ic: 'check', onClick: () => {
          setState('settingsData', {
            ...settings,
            general: { storeName: nameIn.value, storeEmail: emailIn.value, phone: phoneIn.value, currency: currIn.value, timezone: tzIn.value, language: langIn.value },
          });
          toast('Settings saved', 'success');
        }}),
      ),
    );
  } else if (_tab === 'payment') {
    content = panel({ title: 'Payment Settings' },
      h('div', { className: 'space-y-5' },
        settingRow('UPI Payments', 'Accept payments via UPI', settings.payment.upiEnabled, (v) => updatePayment('upiEnabled', v)),
        settingRow('Cash on Delivery', 'Allow COD for orders', settings.payment.codEnabled, (v) => updatePayment('codEnabled', v)),
        settingRow('Card Payments', 'Accept credit/debit cards', settings.payment.cardEnabled, (v) => updatePayment('cardEnabled', v)),
        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100' },
          formField('UPI ID', textInput({ value: settings.payment.upiId })),
          formField('Min Order for COD (₹)', textInput({ type: 'number', value: String(settings.payment.minOrderCOD) })),
        ),
      ),
    );
  } else if (_tab === 'notifications') {
    content = panel({ title: 'Notification Preferences' },
      h('div', { className: 'space-y-5' },
        settingRow('Order Email Alerts', 'Send email on new orders', settings.notifications.orderEmail, (v) => updateNotif('orderEmail', v)),
        settingRow('Order SMS Alerts', 'Send SMS on new orders', settings.notifications.orderSMS, (v) => updateNotif('orderSMS', v)),
        settingRow('Low Stock Alerts', 'Alert when stock is low', settings.notifications.lowStockAlert, (v) => updateNotif('lowStockAlert', v)),
        settingRow('Review Alerts', 'Alert on new reviews', settings.notifications.reviewAlert, (v) => updateNotif('reviewAlert', v)),
        h('div', { className: 'pt-4 border-t border-gray-100 max-w-xs' },
          formField('Low Stock Threshold', textInput({ type: 'number', value: String(settings.notifications.lowStockThreshold) })),
        ),
      ),
    );
  } else if (_tab === 'delivery') {
    const freeMinIn = textInput({ type: 'number', value: String(settings.delivery.freeDeliveryMin) });
    const chargeIn = textInput({ type: 'number', value: String(settings.delivery.deliveryCharge) });
    const estIn = textInput({ value: settings.delivery.estimatedDays });
    const radiusIn = textInput({ value: settings.delivery.deliveryRadius });

    content = panel({ title: 'Delivery Settings' },
      h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
        formField('Free Delivery Min (₹)', freeMinIn),
        formField('Delivery Charge (₹)', chargeIn),
        formField('Estimated Delivery', estIn),
        formField('Delivery Radius', radiusIn),
      ),
      h('div', { className: 'flex justify-end mt-5' },
        btn('Save', { variant: 'primary', ic: 'check', onClick: () => {
          setState('settingsData', {
            ...settings,
            delivery: { freeDeliveryMin: Number(freeMinIn.value), deliveryCharge: Number(chargeIn.value), estimatedDays: estIn.value, deliveryRadius: radiusIn.value },
          });
          toast('Delivery settings saved', 'success');
        }}),
      ),
    );
  }

  mount(root, h('div', { className: 'space-y-5 view-enter' }, tabRow, content));

  function updatePayment(key, val) {
    const s = getState().settingsData;
    setState('settingsData', { ...s, payment: { ...s.payment, [key]: val } });
    toast('Payment setting updated', 'success');
    draw(root);
  }
  function updateNotif(key, val) {
    const s = getState().settingsData;
    setState('settingsData', { ...s, notifications: { ...s.notifications, [key]: val } });
    toast('Notification setting updated', 'success');
    draw(root);
  }
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
