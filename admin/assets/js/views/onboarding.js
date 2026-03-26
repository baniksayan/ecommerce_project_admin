/* ===== Onboarding View ===== */
import { h, mount } from '../utils/dom.js';
import { icon } from '../utils/icons.js';
import { panel, btn, formField, textInput, textArea, toast } from '../components/ui.js';

const onboardingSlides = [
  { id: 1, title: 'Welcome to Mandal Variety', subtitle: 'Your one-stop neighbourhood store, now online.', image: '🛒', active: true },
  { id: 2, title: 'Fresh & Daily Essentials', subtitle: 'Fruits, vegetables, dairy — delivered to your door.', image: '🍎', active: true },
  { id: 3, title: 'Fast & Reliable Delivery', subtitle: 'Get your order within hours, not days.', image: '🚚', active: true },
];

export function renderOnboarding(root) {
  const header = h('div', { className: 'flex items-center justify-between mb-5' },
    h('div', {},
      h('h2', { className: 'text-lg font-bold text-gray-900' }, 'Onboarding Screens'),
      h('p', { className: 'text-xs text-gray-500 mt-0.5' }, 'Manage the onboarding flow users see on first launch'),
    ),
    btn('Add Slide', { variant: 'primary', size: 'sm', ic: 'plus' }),
  );

  const slides = h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-5' },
    ...onboardingSlides.map((slide, idx) =>
      h('div', { className: 'bg-white border border-gray-200/70 rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition' },
        h('div', { className: 'h-40 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-6xl' }, slide.image),
        h('div', { className: 'p-5' },
          h('div', { className: 'flex items-center justify-between mb-2' },
            h('span', { className: 'text-[11px] font-semibold text-gray-400 uppercase' }, `Slide ${idx + 1}`),
            h('span', { className: `w-2 h-2 rounded-full ${slide.active ? 'bg-green-500' : 'bg-gray-300'}` }),
          ),
          h('h3', { className: 'text-sm font-bold text-gray-900' }, slide.title),
          h('p', { className: 'text-xs text-gray-500 mt-1 leading-relaxed' }, slide.subtitle),
          h('div', { className: 'flex items-center gap-2 mt-4 pt-3 border-t border-gray-100' },
            btn('Edit', { size: 'sm', ic: 'edit', className: 'flex-1' }),
            btn('', { size: 'sm', ic: 'trash', variant: 'ghost', className: 'text-red-500' }),
          ),
        ),
      )
    )
  );

  const previewPanel = panel({ title: 'Onboarding Preview', subtitle: 'How users see the flow' },
    h('div', { className: 'flex items-center justify-center gap-6 py-8' },
      ...onboardingSlides.map((slide, idx) =>
        h('div', { className: 'text-center' },
          h('div', { className: 'w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-3xl mb-2 mx-auto' }, slide.image),
          h('p', { className: 'text-[11px] font-semibold text-gray-700' }, `Step ${idx + 1}`),
        )
      ),
    ),
    h('div', { className: 'flex justify-center gap-2' },
      ...onboardingSlides.map((_, idx) =>
        h('div', { className: `w-2 h-2 rounded-full ${idx === 0 ? 'bg-brand-500' : 'bg-gray-300'}` })
      ),
    ),
  );

  mount(root, h('div', { className: 'space-y-5 view-enter' }, header, slides, previewPanel));
}
