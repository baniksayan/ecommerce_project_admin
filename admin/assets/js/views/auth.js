/* ===== Auth Management View ===== */
import { h, mount } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { panel, btn, formField, textInput, toggle, toast } from '../components/ui.js';

let authConfig = {
  emailLogin: true,
  otpLogin: true,
  googleSSO: false,
  otpLength: 6,
  otpExpiry: 5,
  maxAttempts: 5,
};

export function renderAuth(root) {
  const content = panel({ title: 'Authentication Settings', subtitle: 'Configure how users sign in' },
    h('div', { className: 'space-y-5' },
      settingRow('Email + Password Login', 'Allow users to sign in via email', authConfig.emailLogin, v => { authConfig.emailLogin = v; renderAuth(root); }),
      settingRow('OTP Verification', 'Send OTP via SMS for login', authConfig.otpLogin, v => { authConfig.otpLogin = v; renderAuth(root); }),
      settingRow('Google SSO', 'Allow Google sign-in (coming soon)', authConfig.googleSSO, v => { authConfig.googleSSO = v; renderAuth(root); }),
      h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100' },
        formField('OTP Length', textInput({ type: 'number', value: String(authConfig.otpLength), min: '4', max: '8' })),
        formField('OTP Expiry (mins)', textInput({ type: 'number', value: String(authConfig.otpExpiry) })),
        formField('Max Login Attempts', textInput({ type: 'number', value: String(authConfig.maxAttempts) })),
      ),
      h('div', { className: 'flex justify-end' },
        btn('Save', { variant: 'primary', ic: 'check', onClick: () => toast('Auth settings saved', 'success') }),
      ),
    ),
  );

  const flowCards = h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
    flowCard('Auth Entry', 'User chooses login method (Email / OTP / SSO)', 'auth'),
    flowCard('Email Login', 'Enter email + password → validate → sign in', 'contact'),
    flowCard('OTP Verification', 'Enter phone → receive OTP → verify → sign in', 'onboarding'),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, content, h('h3', { className: 'text-sm font-bold text-gray-900 mt-2' }, 'Auth Flow Overview'), flowCards));
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

function flowCard(title, desc, ic) {
  return h('div', { className: 'flex items-start gap-4 p-5 bg-white border border-gray-200/70 rounded-2xl shadow-sm' },
    h('div', { className: 'w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center flex-shrink-0', html: icon(ic, 'w-5 h-5') }),
    h('div', {},
      h('h4', { className: 'text-sm font-bold text-gray-900' }, title),
      h('p', { className: 'text-xs text-gray-500 mt-1 leading-relaxed' }, desc),
    ),
  );
}
