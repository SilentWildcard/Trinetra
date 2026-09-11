/**
 * Screen 7: Emergency Contacts & Trusted Circle
 * Trinetra — Autonomous Safety Guardian
 */

export function renderEmergencyContactsScreen(state) {
  const contacts = state.contacts || [];

  return `
    <div class="h-full flex flex-col justify-between p-5 overflow-y-auto bg-gradient-to-b from-[#050811] via-[#090e1f] to-[#04060d]">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-purple-900/30">
        <div class="flex items-center gap-2">
          <button id="btn-contacts-back" class="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-slate-300 hover:text-white">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Emergency Contacts</h2>
            <p class="text-[10px] text-purple-300 font-mono">Instant Beacon Recipients</p>
          </div>
        </div>

        <button id="btn-add-contact" class="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          Add
        </button>
      </div>

      <!-- Contacts List -->
      <div class="flex-1 space-y-2.5 py-3">
        ${contacts.map(c => `
          <div class="glass-panel p-3 rounded-2xl flex items-center justify-between hover:border-purple-500/40 transition">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-slate-800 border border-purple-500/30 flex items-center justify-center text-xl shadow">
                ${c.avatar || '👤'}
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h3 class="text-xs font-bold text-white">${c.name}</h3>
                  <span class="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    ${c.relation}
                  </span>
                </div>
                <p class="text-[10px] text-slate-400 font-mono mt-0.5">${c.phone}</p>
                <div class="flex items-center gap-2 mt-1 text-[9px] text-slate-300 font-mono">
                  <span class="flex items-center gap-0.5 text-emerald-400">
                    <i data-lucide="message-square" class="w-3 h-3"></i> SMS ${c.notifySms ? 'ON' : 'OFF'}
                  </span>
                  <span class="flex items-center gap-0.5 ${c.notifyCall ? 'text-purple-400' : 'text-slate-500'}">
                    <i data-lucide="phone-call" class="w-3 h-3"></i> Call ${c.notifyCall ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-end gap-1">
              <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Priority ${c.priority}
              </span>
              <button class="text-slate-400 hover:text-purple-300 p-1" title="Test Call Simulation" onclick="alert('Simulating emergency test call to ${c.name} (${c.phone})')">
                <i data-lucide="phone-outgoing" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `).join('')}

        <!-- Broadcast Message Preview Card -->
        <div class="glass-panel p-3 rounded-2xl border border-purple-900/50 bg-slate-950/60 mt-3">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
              <i data-lucide="file-text" class="w-3 h-3 text-purple-400"></i>
              Live SMS Dispatch Preview
            </span>
            <span class="text-[9px] text-slate-400 font-mono">Automated Template</span>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-300 leading-relaxed">
            "EMERGENCY ALERT from Payal: Trinetra detected autonomous distress (struggle/fall anomaly). Live GPS: https://trinetra.safety/track/28.5458,77.1926. Immediate assistance may be required."
          </div>
        </div>
      </div>

      <!-- Bottom Helper -->
      <div class="pt-2">
        <button id="btn-contacts-done" class="w-full py-3 rounded-xl glass-panel hover:bg-slate-800/80 text-white font-semibold text-xs transition">
          Return to Dashboard
        </button>
      </div>
    </div>
  `;
}

export function attachEmergencyContactsEvents(container, app) {
  const backBtn = container.querySelector('#btn-contacts-back');
  if (backBtn) backBtn.addEventListener('click', () => app.navigateTo('home'));

  const doneBtn = container.querySelector('#btn-contacts-done');
  if (doneBtn) doneBtn.addEventListener('click', () => app.navigateTo('home'));

  const addBtn = container.querySelector('#btn-add-contact');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = prompt('Enter Contact Name:', 'Bhaiya (Aakash)');
      const phone = prompt('Enter Phone Number:', '+91 99887 76655');
      if (name && phone) {
        app.state.contacts.push({
          id: 'c' + (app.state.contacts.length + 1),
          name: name,
          phone: phone,
          relation: 'Family',
          priority: app.state.contacts.length + 1,
          notifySms: true,
          notifyCall: true,
          avatar: '🧑‍💼',
          status: 'Ready'
        });
        app.navigateTo('contacts');
      }
    });
  }
}
