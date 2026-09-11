/**
 * Screen 1: Welcome & Authentication / Onboarding
 * Trinetra — Autonomous Safety Guardian
 */

export function renderWelcomeScreen(state) {
  return `
    <div class="h-full flex flex-col justify-between p-6 relative overflow-hidden bg-gradient-to-b from-[#070b14] via-[#0b1224] to-[#050811]">
      <!-- Background Ambient Glow -->
      <div class="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none"></div>

      <!-- Top Header & Badge -->
      <div class="pt-4 flex flex-col items-center text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-medium tracking-wide uppercase shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <i data-lucide="shield-check" class="w-3.5 h-3.5 text-purple-400"></i>
          Hackathon Prototype
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight mt-3 text-white">
          TRIN<span class="text-purple-400">E</span>TRA
        </h1>
        <p class="text-xs text-purple-300/80 font-mono tracking-widest mt-0.5 uppercase">
          Autonomous Safety Guardian
        </p>
      </div>

      <!-- Central Visual Art: The Watchful Third Eye -->
      <div class="flex-1 flex flex-col items-center justify-center my-4 relative z-10">
        <div class="relative w-56 h-56 flex items-center justify-center">
          <!-- Outer Pulsing Halo Rings -->
          <div class="absolute inset-0 rounded-full border border-purple-500/20 animate-pulse-ring"></div>
          <div class="absolute -inset-4 rounded-full border border-cyan-500/15 animate-pulse-ring" style="animation-delay: 1s;"></div>
          
          <!-- Concentric Sacred Reticle Rings -->
          <div class="w-48 h-48 rounded-full border-2 border-dashed border-purple-500/40 flex items-center justify-center p-2 relative animate-radar">
            <span class="absolute top-0 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"></span>
            <span class="absolute bottom-0 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7]"></span>
          </div>

          <!-- Central Brand Artwork Eye -->
          <div class="absolute w-40 h-40 rounded-full overflow-hidden border-2 border-purple-400/80 glow-purple shadow-2xl bg-black animate-eye-breathe">
            <img src="assets/trinetra-eye.png" alt="Trinetra Third Eye" class="w-full h-full object-cover" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\' fill=\'%23a855f7\'><circle cx=\'50\' cy=\'50\' r=\'40\'/></svg>'" />
          </div>
        </div>

        <p class="text-sm font-medium text-slate-300 mt-5 text-center px-4">
          "Three Eyes. One Promise. Total Protection."
        </p>

        <!-- The 3 Signal Icons -->
        <div class="grid grid-cols-3 gap-2 w-full max-w-xs mt-4">
          <div class="glass-panel p-2.5 rounded-xl flex flex-col items-center text-center">
            <i data-lucide="mic" class="w-4 h-4 text-purple-400 mb-1"></i>
            <span class="text-[11px] font-semibold text-slate-200">Voice Eye</span>
            <span class="text-[9px] text-slate-400">AI Code Words</span>
          </div>
          <div class="glass-panel p-2.5 rounded-xl flex flex-col items-center text-center">
            <i data-lucide="smartphone" class="w-4 h-4 text-cyan-400 mb-1"></i>
            <span class="text-[11px] font-semibold text-slate-200">Motion Eye</span>
            <span class="text-[9px] text-slate-400">Fall & Struggle</span>
          </div>
          <div class="glass-panel p-2.5 rounded-xl flex flex-col items-center text-center">
            <i data-lucide="map-pin" class="w-4 h-4 text-emerald-400 mb-1"></i>
            <span class="text-[11px] font-semibold text-slate-200">Location Eye</span>
            <span class="text-[9px] text-slate-400">Route Deviation</span>
          </div>
        </div>
      </div>

      <!-- Bottom Authentication & Action Card -->
      <div class="glass-panel rounded-2xl p-4 flex flex-col gap-3 relative z-10 shadow-xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
              P
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-200">Payal Sharma</p>
              <p class="text-[10px] text-slate-400 font-mono">+91 98*** **412 • Verified</p>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Guardian Ready
          </span>
        </div>

        <button 
          id="btn-activate-guardian"
          class="w-full py-3.5 px-4 rounded-xl font-semibold text-sm tracking-wide bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg glow-purple transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
          <i data-lucide="power" class="w-4 h-4"></i>
          ACTIVATE GUARDIAN
        </button>

        <p class="text-[10px] text-slate-400 text-center">
          Continuous passive telemetry. On-device privacy first.
        </p>
      </div>
    </div>
  `;
}

export function attachWelcomeEvents(container, app) {
  const btn = container.querySelector('#btn-activate-guardian');
  if (btn) {
    btn.addEventListener('click', async () => {
      // Start browser sensors if user allows
      app.startSensors();
      app.navigateTo('home');
    });
  }
}
