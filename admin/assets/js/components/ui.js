/* ===== Reusable UI Components ===== */
import { h, currency, formatDate } from '../utils/dom.js';
import { icon } from '../utils/icons.js';

/* ---------- Metric Card ---------- */
export function metricCard({ label, value, change, changeDir, icon: ic, color = 'brand' }) {
  const colors = {
    brand:   'from-brand-500/10 to-brand-400/5 border-brand-200/60',
    green:   'from-green-500/10 to-green-400/5 border-green-200/60',
    blue:    'from-blue-500/10 to-blue-400/5 border-blue-200/60',
    red:     'from-red-500/10 to-red-400/5 border-red-200/60',
    orange:  'from-orange-500/10 to-orange-400/5 border-orange-200/60',
    purple:  'from-purple-500/10 to-purple-400/5 border-purple-200/60',
  };
  const iconBg = {
    brand: 'bg-brand-500/15 text-brand-600',
    green: 'bg-green-500/15 text-green-600',
    blue:  'bg-blue-500/15 text-blue-600',
    red:   'bg-red-500/15 text-red-600',
    orange:'bg-orange-500/15 text-orange-600',
    purple:'bg-purple-500/15 text-purple-600',
  };
  const changeCls = changeDir === 'up' ? 'text-green-600' : changeDir === 'down' ? 'text-red-500' : 'text-gray-500';
  const arrow = changeDir === 'up' ? icon('arrowUp', 'w-3.5 h-3.5') : changeDir === 'down' ? icon('arrowDown', 'w-3.5 h-3.5') : '';

  return h('div', { className: `bg-gradient-to-br ${colors[color] || colors.brand} border rounded-2xl p-5 transition hover:shadow-md hover:-translate-y-0.5` },
    h('div', { className: 'flex items-start justify-between mb-3' },
      h('div', { className: `w-10 h-10 rounded-xl ${iconBg[color] || iconBg.brand} flex items-center justify-center`, html: icon(ic || 'dashboard', 'w-5 h-5') }),
      change != null ? h('div', { className: `flex items-center gap-0.5 text-xs font-semibold ${changeCls}`, html: `${arrow} ${change}` }) : null,
    ),
    h('div', { className: 'text-2xl font-extrabold text-gray-900 tracking-tight' }, String(value)),
    h('div', { className: 'text-xs text-gray-500 mt-1 font-medium' }, label),
  );
}

/* ---------- Status Badge ---------- */
export function badge(text, variant = 'default') {
  const map = {
    default:   'bg-gray-100 text-gray-700',
    success:   'bg-green-50 text-green-700 border-green-200/60',
    warning:   'bg-amber-50 text-amber-700 border-amber-200/60',
    danger:    'bg-red-50 text-red-700 border-red-200/60',
    info:      'bg-blue-50 text-blue-700 border-blue-200/60',
    brand:     'bg-brand-50 text-brand-600 border-brand-200/60',
    orange:    'bg-orange-50 text-orange-700 border-orange-200/60',
    purple:    'bg-purple-50 text-purple-700 border-purple-200/60',
  };
  return h('span', { className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${map[variant] || map.default}` }, text);
}

/* ---------- Order status → badge ---------- */
export function orderBadge(status) {
  const m = { pending: 'warning', shipped: 'info', delivered: 'success', cancelled: 'danger' };
  return badge(status.charAt(0).toUpperCase() + status.slice(1), m[status] || 'default');
}

/* ---------- Data Table ---------- */
export function dataTable({ columns, rows, onRowClick, emptyMsg = 'No data found', className = '' }) {
  if (!rows.length) {
    return h('div', { className: 'flex flex-col items-center justify-center py-16 text-gray-400' },
      h('div', { html: icon('products', 'w-12 h-12 mb-3 opacity-40') }),
      h('p', { className: 'text-sm' }, emptyMsg),
    );
  }

  const thead = h('thead', {},
    h('tr', { className: 'border-b border-gray-100' },
      ...columns.map(col =>
        h('th', { className: `text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 ${col.className || ''}` }, col.label)
      )
    )
  );

  const tbody = h('tbody', {},
    ...rows.map((row, idx) =>
      h('tr', {
        className: `border-b border-gray-50 table-row-hover transition ${onRowClick ? 'cursor-pointer' : ''}`,
        ...(onRowClick ? { onClick: () => onRowClick(row, idx) } : {}),
      },
        ...columns.map(col =>
          h('td', { className: `py-3 px-4 text-sm ${col.tdClass || ''}` },
            col.render ? col.render(row, idx) : h('span', {}, String(row[col.key] ?? ''))
          )
        )
      )
    )
  );

  return h('div', { className: `overflow-x-auto ${className}` },
    h('table', { className: 'w-full min-w-[600px]' }, thead, tbody)
  );
}

/* ---------- Panel / Card wrapper ---------- */
export function panel({ title, subtitle, actions, noPad, className = '' }, ...children) {
  return h('div', { className: `bg-white border border-gray-200/70 rounded-2xl shadow-sm shadow-gray-200/40 ${className}` },
    (title || actions) ? h('div', { className: 'flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100' },
      h('div', {},
        title ? h('h3', { className: 'text-sm font-bold text-gray-900' }, title) : null,
        subtitle ? h('p', { className: 'text-[11px] text-gray-500 mt-0.5' }, subtitle) : null,
      ),
      actions ? h('div', { className: 'flex items-center gap-2 flex-shrink-0' }, ...([].concat(actions))) : null,
    ) : null,
    h('div', { className: noPad ? '' : 'p-5' }, ...children),
  );
}

/* ---------- Button ---------- */
export function btn(text, { variant = 'default', size = 'md', ic, onClick, className = '', type = 'button', disabled = false } = {}) {
  const vars = {
    default: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
    primary: 'bg-brand-500 border border-brand-600 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm shadow-brand-500/20',
    danger:  'bg-red-500 border border-red-600 text-white hover:bg-red-600 active:bg-red-700',
    ghost:   'bg-transparent text-gray-600 hover:bg-gray-100',
    success: 'bg-green-600 border border-green-700 text-white hover:bg-green-700',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  };

  return h('button', {
    className: `inline-flex items-center justify-center font-semibold transition-all active:scale-[.97] ${vars[variant] || vars.default} ${sizes[size] || sizes.md} ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`,
    type,
    ...(onClick ? { onClick } : {}),
    ...(disabled ? { disabled: 'true' } : {}),
  },
    ic ? h('span', { html: icon(ic, size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'), className: 'flex-shrink-0' }) : null,
    text,
  );
}

/* ---------- Form Input ---------- */
export function formField(label, inputEl, { id, helpText } = {}) {
  return h('div', { className: 'space-y-1.5' },
    h('label', { className: 'block text-xs font-semibold text-gray-700', ...(id ? { for: id } : {}) }, label),
    inputEl,
    helpText ? h('p', { className: 'text-[11px] text-gray-400' }, helpText) : null,
  );
}

export function textInput(props = {}) {
  return h('input', {
    className: 'w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition',
    type: 'text',
    ...props,
  });
}

export function selectInput(options = [], props = {}) {
  const sel = h('select', {
    className: 'w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition appearance-none',
    ...props,
  },
    ...options.map(o => {
      const opt = typeof o === 'string' ? { value: o, label: o } : o;
      return h('option', { value: opt.value }, opt.label);
    })
  );
  return sel;
}

export function textArea(props = {}) {
  return h('textarea', {
    className: 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm placeholder-gray-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition resize-y min-h-[80px]',
    ...props,
  });
}

/* ---------- Modal ---------- */
export function openModal({ title, body, footer, width = 'max-w-lg' }) {
  const root = document.getElementById('modalRoot');
  const close = () => { root.innerHTML = ''; };

  const backdrop = h('div', {
    className: 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-center justify-center p-4 modal-backdrop',
    onClick: (e) => { if (e.target === backdrop) close(); },
  },
    h('div', { className: `bg-white rounded-2xl shadow-2xl w-full ${width} modal-panel overflow-hidden`, onClick: e => e.stopPropagation() },
      h('div', { className: 'flex items-center justify-between px-5 py-4 border-b border-gray-100' },
        h('h3', { className: 'text-sm font-bold text-gray-900' }, title || 'Dialog'),
        h('button', { className: 'w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500', html: icon('x', 'w-4 h-4'), onClick: close }),
      ),
      h('div', { className: 'p-5 max-h-[70vh] overflow-y-auto' }, ...(Array.isArray(body) ? body : [body])),
      footer ? h('div', { className: 'flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50/50' }, ...(Array.isArray(footer) ? footer : [footer])) : null,
    ),
  );

  root.innerHTML = '';
  root.append(backdrop);

  return close;
}

/* ---------- Toast ---------- */
export function toast(message, variant = 'success', duration = 3000) {
  const root = document.getElementById('toastRoot');
  const colors = {
    success: 'bg-green-600 text-white',
    error:   'bg-red-600 text-white',
    warning: 'bg-amber-500 text-white',
    info:    'bg-blue-600 text-white',
  };
  const ic = { success: 'check', error: 'x', warning: 'tobacco', info: 'eye' };

  const el = h('div', { className: `pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-slide-up ${colors[variant] || colors.info}` },
    h('span', { html: icon(ic[variant] || 'check', 'w-4 h-4'), className: 'flex-shrink-0' }),
    message,
  );

  root.append(el);
  setTimeout(() => el.remove(), duration);
}

/* ---------- Tabs ---------- */
export function tabs(items, activeId, onChange) {
  return h('div', { className: 'flex items-center gap-1 border-b border-gray-200 mb-5 overflow-x-auto' },
    ...items.map(item =>
      h('button', {
        className: `px-4 py-2.5 text-sm font-medium transition whitespace-nowrap ${item.id === activeId ? 'text-brand-600 tab-active' : 'text-gray-500 hover:text-gray-700'}`,
        onClick: () => onChange(item.id),
      }, item.label)
    )
  );
}

/* ---------- Empty State ---------- */
export function emptyState(message, ic = 'products') {
  return h('div', { className: 'flex flex-col items-center justify-center py-20 text-gray-400' },
    h('div', { html: icon(ic, 'w-16 h-16 mb-4 opacity-30') }),
    h('p', { className: 'text-sm font-medium' }, message),
  );
}

/* ---------- Skeleton Loader ---------- */
export function skeleton(width = 'w-full', height = 'h-4') {
  return h('div', { className: `skeleton ${width} ${height}` });
}

export function skeletonRows(count = 5) {
  return h('div', { className: 'space-y-3' },
    ...Array.from({ length: count }, () =>
      h('div', { className: 'flex gap-4 items-center' },
        skeleton('w-10', 'h-10 rounded-lg'),
        h('div', { className: 'flex-1 space-y-2' },
          skeleton('w-3/4', 'h-4'),
          skeleton('w-1/2', 'h-3'),
        ),
      )
    )
  );
}

/* ---------- Star Rating ---------- */
export function stars(rating, max = 5) {
  return h('div', { className: 'flex items-center gap-0.5' },
    ...Array.from({ length: max }, (_, i) =>
      h('span', { className: `text-sm ${i < rating ? 'text-amber-400' : 'text-gray-300'}` }, '★')
    )
  );
}

/* ---------- Toggle switch ---------- */
export function toggle(checked, onChange) {
  const track = h('div', { className: `toggle-track ${checked ? 'active' : ''}`, onClick: () => onChange && onChange(!checked) },
    h('div', { className: 'toggle-knob' })
  );
  return track;
}
