/**
 * Screen 5: Safety Confirmation ("Are You Safe?")
 * Trinetra — Autonomous Safety Guardian
 * Soft confirmation check-in with 15-second auto-escalation countdown.
 */

let countdownTimer = null;
let currentSeconds = 15;

export function clearSafetyCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

export function renderSafetyConfirmScreen(state, engineState) {
  currentSeconds = state.settings.countdownSeconds || 15;

  return `
    <div class="h-full flex flex-col justify-between p-6 relative overflow-hidden bg-gradient-to-b from-[#1b070f] via-[#10091d] to-[#050811]">
      <!-- Pulsing Ambient Danger Light -->
      <div class="absolute inset-0 bg-rose-600/10 pointer-events-none animate-pulse"></div>

      <!-- Header -->
      <div class="text-center pt-2 relative z-10">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 border border-rose-500/60 text-rose-300 text-xs font-bold font-mono uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          Autonomous Safety Check
        </span>
        <h1 class="text-2xl font-extrabold text-white tracking-tight mt-3">
          ARE YOU SAFE?
        </h1>
        <p class="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
          Trinetra detected an anomaly. If you are safe, please confirm below.
        </p>
      </div>

      <!-- Center: 15-Second Animated Circular Countdown Timer -->
      <div class="flex-1 flex flex-col items-center justify-center my-4 relative z-10">
        <div class="relative w-48 h-48 flex items-center justify-center">
          <!-- Circular SVG Countdown Ring -->
          <svg class="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(244, 63, 94, 0.15)" stroke-width="8" />
            <circle id="countdown-progress-ring" cx="60" cy="60" r="52" fill="none" stroke="#f43f5e" stroke-width="8"
                    stroke-dasharray="326.7" stroke-dashoffset="0" stroke-linecap="round"
                    class="transition-all duration-1000 ease-linear shadow-[0_0_15px_#f43f5e]" />
          </svg>

          <!-- Inside Countdown Number -->
          <div class="absolute flex flex-col items-center justify-center text-center">
            <span id="countdown-display" class="text-5xl font-extrabold font-mono text-white tracking-tighter drop-shadow-md">
              15
            </span>
            <span class="text-[10px] text-rose-300/80 uppercase font-mono tracking-wider mt-0.5">
              Seconds Left
            </span>
          </div>
        </div>

        <p class="text-[11px] text-rose-300/90 font-mono mt-4 text-center max-w-xs bg-rose-950/40 p-2 rounded-xl border border-rose-900/50">
          Auto-escalating to <strong class="text-rose-200">Silent SOS</strong> if no response is received.
        </p>
      </div>

      <!-- Two Large Action Buttons: I'm Safe vs I Need Help -->
      <div class="space-y-3 relative z-10">
        <!-- 1. I'M SAFE (False Alarm) -->
        <button 
          id="btn-confirm-im-safe"
          class="w-full py-4 px-5 rounded-2xl font-extrabold text-base tracking-wide bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-xl shadow-emerald-950/50 border border-emerald-400/40 transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]">
          <i data-lucide="check-circle-2" class="w-5 h-5"></i>
          I'M SAFE (Dismiss Alarm)
        </button>

        <!-- 2. I NEED HELP -->
        <button 
          id="btn-confirm-need-help"
          class="w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm tracking-wider uppercase bg-rose-950 hover:bg-rose-900 text-rose-200 border-2 border-rose-500/70 shadow-xl shadow-rose-950/60 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
          <i data-lucide="alert-octagon" class="w-4 h-4 text-rose-400 animate-pulse"></i>
          I NEED HELP — TRIGGER SOS NOW
        </button>
      </div>
    </div>
  `;
}

export function attachSafetyConfirmEvents(container, app) {
  clearSafetyCountdown();

  currentSeconds = 15;
  const totalSeconds = 15;
  const circumference = 2 * Math.PI * 52; // 326.7

  const displayEl = container.querySelector('#countdown-display');
  const ringEl = container.querySelector('#countdown-progress-ring');

  countdownTimer = setInterval(() => {
    currentSeconds--;

    if (displayEl) {
      displayEl.textContent = currentSeconds;
    }

    if (ringEl) {
      const offset = circumference - (currentSeconds / totalSeconds) * circumference;
      ringEl.style.strokeDashoffset = offset;
    }

    // Auto-escalation when countdown expires!
    if (currentSeconds <= 0) {
      clearSafetyCountdown();
      console.warn('Trinetra: Safety countdown expired without response. Auto-escalating to Silent SOS.');
      app.navigateTo('silentSos', { reason: 'AUTONOMOUS_TIMEOUT' });
    }
  }, 1000);

  // "I'm Safe" Button
  const safeBtn = container.querySelector('#btn-confirm-im-safe');
  if (safeBtn) {
    safeBtn.addEventListener('click', () => {
      clearSafetyCountdown();
      app.resetToSafeBaseline();
    });
  }

  // "I Need Help" Button
  const needHelpBtn = container.querySelector('#btn-confirm-need-help');
  if (needHelpBtn) {
    needHelpBtn.addEventListener('click', () => {
      clearSafetyCountdown();
      app.navigateTo('silentSos', { reason: 'USER_DISTRESS_CONFIRMATION' });
    });
  }
}
