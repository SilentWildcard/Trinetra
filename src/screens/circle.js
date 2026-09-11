/**
 * Screen 9: Guardian Circle (Family & Friends Safety Network)
 * Trinetra — Autonomous Safety Guardian
 */

export function renderCircleScreen(state) {
  const circle = state.circle || [];

  return `
    <div class="h-full flex flex-col justify-between p-5 overflow-y-auto bg-gradient-to-b from-[#050811] via-[#090e1f] to-[#04060d]">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-purple-900/30">
        <div class="flex items-center gap-2">
          <button id="btn-circle-back" class="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-slate-300 hover:text-white">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Guardian Circle</h2>
            <p class="text-[10px] text-purple-300 font-mono">Mutual Safety Network</p>
          </div>
        </div>

        <button id="btn-add-circle" class="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm">
          <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
          Invite
        </button>
      </div>

      <!-- Circle Members Cards -->
      <div class="flex-1 space-y-3 py-3">
        <div class="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-slate-300 flex items-center gap-2.5">
          <i data-lucide="heart-pulse" class="w-5 h-5 text-purple-400 flex-shrink-0"></i>
          <span>All 3 members of your circle are currently in verified safe zones with active guardians.</span>
        </div>

        ${circle.map(m => `
          <div class="glass-panel p-3.5 rounded-2xl flex items-center justify-between hover:border-purple-500/40 transition">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-slate-800 border border-purple-500/30 flex items-center justify-center text-xl shadow">
                ${m.avatar}
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h3 class="text-xs font-bold text-white">${m.name}</h3>
                  <span class="text-[8px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    PROTECTED
                  </span>
                </div>
                <p class="text-[10px] text-slate-300 font-mono mt-0.5">${m.location}</p>
                <p class="text-[9px] text-slate-400 font-mono mt-0.5">Ping: ${m.lastPing} • Battery: ${m.battery}</p>
              </div>
            </div>

            <button class="p-2 rounded-xl bg-slate-800/70 hover:bg-purple-900/40 text-slate-300 hover:text-purple-300 border border-slate-700 transition" 
                    title="Send Safety Heartbeat" onclick="alert('Heartbeat request sent to ${m.name}')">
              <i data-lucide="bell-ring" class="w-4 h-4"></i>
            </button>
          </div>
        `).join('')}
      </div>

      <!-- Bottom Done Button -->
      <div class="pt-2">
        <button id="btn-circle-done" class="w-full py-3 rounded-xl glass-panel hover:bg-slate-800/80 text-white font-semibold text-xs transition">
          Return to Dashboard
        </button>
      </div>
    </div>
  `;
}

export function attachCircleEvents(container, app) {
  const backBtn = container.querySelector('#btn-circle-back');
  if (backBtn) backBtn.addEventListener('click', () => app.navigateTo('home'));

  const doneBtn = container.querySelector('#btn-circle-done');
  if (doneBtn) doneBtn.addEventListener('click', () => app.navigateTo('home'));

  const addBtn = container.querySelector('#btn-add-circle');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = prompt('Invite friend or family to your Circle:', 'Kabir');
      if (name) {
        app.state.circle.push({
          id: 'u' + (app.state.circle.length + 1),
          name: name,
          status: 'Protected',
          battery: '94%',
          location: 'Safe • Connaught Place',
          lastPing: 'Just now',
          risk: 'NORMAL',
          avatar: '🧑'
        });
        app.navigateTo('circle');
      }
    });
  }
}
