/**
 * Trinetra — Bottom Navigation Bar Component
 */

export function renderBottomNav(activeScreen, navigateTo) {
  const items = [
    { id: 'home', label: 'Guardian', icon: 'shield' },
    { id: 'monitoring', label: 'Telemetry', icon: 'activity' },
    { id: 'journey', label: 'Journey', icon: 'map-pin' },
    { id: 'contacts', label: 'Contacts', icon: 'users' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  const html = `
    <nav class="h-16 glass-panel border-t border-purple-900/30 flex items-center justify-around px-2 relative z-20">
      ${items.map(item => {
        const isActive = activeScreen === item.id;
        return `
          <button 
            data-nav="${item.id}"
            class="flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive 
                ? 'text-purple-400 font-medium' 
                : 'text-slate-400 hover:text-slate-200'
            }">
            <div class="relative">
              <i data-lucide="${item.icon}" class="w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}"></i>
              ${isActive ? '<span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]"></span>' : ''}
            </div>
            <span class="text-[10px] mt-1 tracking-tight">${item.label}</span>
          </button>
        `;
      }).join('')}
    </nav>
  `;

  return html;
}

export function attachBottomNavEvents(container, navigateTo) {
  container.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-nav');
      navigateTo(target);
    });
  });
}
