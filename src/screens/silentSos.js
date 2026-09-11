/**
 * Screen 6: Silent SOS Active Screen
 * Trinetra — Autonomous Safety Guardian
 * Covert distress broadcasting with live location beacon, contact dispatches, and evidence vault.
 */

export function renderSilentSosScreen(state, engineState, params = {}) {
  const coords = state.sensors.location.coords || { latitude: 28.5458, longitude: 77.1926 };
  const reasonText = params.reason === 'AUTONOMOUS_TIMEOUT' 
    ? 'Triggered autonomously: Countdown expired without confirmation.'
    : params.reason === 'USER_DISTRESS_CONFIRMATION'
    ? 'Triggered via user confirmation: "I Need Help".'
    : 'Triggered directly via Silent SOS button.';

  return `
    <div class="h-full flex flex-col justify-between p-5 relative overflow-hidden bg-gradient-to-b from-[#1f050b] via-[#120817] to-[#04060d]">
      <!-- Covert Crimson Beacon Glow -->
      <div class="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-rose-600/25 blur-3xl animate-pulse pointer-events-none"></div>

      <!-- Top Header -->
      <div class="flex items-center justify-between pt-1 relative z-10">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
          <span class="text-xs font-bold text-rose-300 font-mono tracking-wider uppercase">
            SILENT SOS BROADCASTING
          </span>
        </div>

        <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-200">
          COVERT MODE
        </span>
      </div>

      <!-- Main Distress Status Card -->
      <div class="flex-1 my-3 space-y-3 overflow-y-auto relative z-10">
        <div class="glass-panel-danger p-4 rounded-2xl text-center">
          <div class="w-16 h-16 rounded-full bg-rose-950 border-2 border-rose-500 mx-auto flex items-center justify-center text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.6)]">
            <i data-lucide="radio" class="w-8 h-8 animate-pulse"></i>
          </div>

          <h2 class="text-lg font-black text-white tracking-wide mt-3 uppercase">
            Emergency Beacon Transmitting
          </h2>
          <p class="text-[10px] text-rose-200/90 font-mono mt-1">
            ${reasonText}
          </p>

          <div class="mt-3 p-2 bg-black/50 rounded-xl border border-rose-900/60 font-mono text-[10px] text-left text-slate-300 space-y-1">
            <div class="flex justify-between">
              <span>Live Coordinates:</span>
              <span class="text-rose-300 font-semibold">${coords.latitude}, ${coords.longitude}</span>
            </div>
            <div class="flex justify-between">
              <span>Telemetry Timestamp:</span>
              <span class="text-slate-400">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="flex justify-between">
              <span>Device Battery:</span>
              <span class="text-emerald-400 font-semibold">86% • Charging</span>
            </div>
          </div>
        </div>

        <!-- Automated Actions Execution Log -->
        <div class="glass-panel p-3.5 rounded-2xl space-y-2">
          <h3 class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <i data-lucide="check-check" class="w-4 h-4 text-emerald-400"></i>
            Autonomous Safety Actions
          </h3>

          <div class="space-y-2 text-[11px]">
            <div class="p-2 rounded-xl bg-slate-900/80 border border-emerald-900/50 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i data-lucide="message-square" class="w-4 h-4 text-emerald-400"></i>
                <div>
                  <p class="font-semibold text-slate-200">SMS Alerts Dispatched</p>
                  <p class="text-[9px] text-slate-400">Sent to Papa & Mom with live tracking link</p>
                </div>
              </div>
              <span class="text-[9px] font-mono text-emerald-400 font-bold">DELIVERED</span>
            </div>

            <div class="p-2 rounded-xl bg-slate-900/80 border border-purple-900/50 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i data-lucide="shield" class="w-4 h-4 text-purple-400"></i>
                <div>
                  <p class="font-semibold text-slate-200">Campus Security Alerted</p>
                  <p class="text-[9px] text-slate-400">Direct telemetry stream connected</p>
                </div>
              </div>
              <span class="text-[9px] font-mono text-purple-300 font-bold">ACTIVE</span>
            </div>

            <div class="p-2 rounded-xl bg-slate-900/80 border border-cyan-900/50 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i data-lucide="mic" class="w-4 h-4 text-cyan-400 animate-pulse"></i>
                <div>
                  <p class="font-semibold text-slate-200">Stealth Evidence Recording</p>
                  <p class="text-[9px] text-slate-400">Audio encrypted in local tamper-proof vault</p>
                </div>
              </div>
              <span class="text-[9px] font-mono text-cyan-400 font-bold">RECORDING</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Deactivate / Disarm SOS Modal Form -->
      <div class="space-y-2 pt-2 relative z-10">
        <button 
          id="btn-open-contacts-status"
          class="w-full py-2.5 px-3 rounded-xl glass-panel hover:bg-slate-800/70 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition">
          <i data-lucide="users" class="w-3.5 h-3.5 text-purple-400"></i>
          View Emergency Contacts & Live Feed
        </button>

        <button 
          id="btn-deactivate-sos"
          class="w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-slate-200 border border-slate-600 shadow-lg transition flex items-center justify-center gap-2 active:scale-[0.98]">
          <i data-lucide="lock" class="w-4 h-4 text-slate-400"></i>
          DEACTIVATE SOS (Enter Safe PIN: 1234)
        </button>
      </div>
    </div>
  `;
}

export function attachSilentSosEvents(container, app) {
  const contactsBtn = container.querySelector('#btn-open-contacts-status');
  if (contactsBtn) {
    contactsBtn.addEventListener('click', () => {
      app.navigateTo('contacts');
    });
  }

  const deactivateBtn = container.querySelector('#btn-deactivate-sos');
  if (deactivateBtn) {
    deactivateBtn.addEventListener('click', () => {
      const pin = prompt('Enter your 4-digit Safety PIN to disarm Silent SOS:', '1234');
      if (pin === '1234') {
        alert('Trinetra: Silent SOS deactivated successfully. Normal monitoring resumed.');
        app.signalFusion.resolveThreat();
        app.navigateTo('home');
      } else if (pin !== null) {
        alert('Incorrect PIN. SOS beacon remains active.');
      }
    });
  }
}
