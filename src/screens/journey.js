/**
 * Screen 8: Journey Live Route & Safe Corridor
 * Trinetra — Autonomous Safety Guardian
 */

export function renderJourneyScreen(state) {
  const j = state.journey;
  const l = state.sensors.location;

  return `
    <div class="h-full flex flex-col justify-between p-5 overflow-y-auto bg-gradient-to-b from-[#050811] via-[#090e1f] to-[#04060d]">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-purple-900/30">
        <div class="flex items-center gap-2">
          <button id="btn-journey-back" class="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-slate-300 hover:text-white">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Live Journey Guardian</h2>
            <p class="text-[10px] text-emerald-300 font-mono">Safe Corridor Tracking Active</p>
          </div>
        </div>

        <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          EN ROUTE
        </span>
      </div>

      <!-- Main Journey Visualizer Card -->
      <div class="flex-1 space-y-3 py-3">
        <!-- SVG Corridor Map Visualization -->
        <div class="glass-panel rounded-2xl p-3 border border-purple-500/20 bg-slate-950/70 relative overflow-hidden">
          <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
            <span>Route Corridor: <strong class="text-slate-200">Outer Ring Rd</strong></span>
            <span class="${l.inCorridor !== false ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-bold'}">
              ${l.inCorridor !== false ? '✓ In Corridor (±8m)' : '⚠ 140m OFF CORRIDOR'}
            </span>
          </div>

          <!-- Stylized Cyber Route Map -->
          <div class="relative w-full h-44 bg-[#070d1e] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <!-- Grid Lines -->
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px]"></div>

            <svg class="w-full h-full p-3" viewBox="0 0 300 160">
              <!-- Safe Corridor Buffer Zone (Green halo) -->
              <path d="M 30 130 Q 110 110 150 75 T 270 30" fill="none" stroke="rgba(16, 185, 129, 0.25)" stroke-width="28" stroke-linecap="round" />
              
              <!-- Intended Safe Route Line -->
              <path d="M 30 130 Q 110 110 150 75 T 270 30" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 4" />

              ${l.inCorridor === false ? `
                <!-- Deviated Path line (Red) -->
                <path d="M 150 75 Q 180 120 220 135" fill="none" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round" />
                <!-- Deviated user position -->
                <circle cx="220" cy="135" r="8" fill="#ef4444" class="animate-ping" opacity="0.75" />
                <circle cx="220" cy="135" r="5" fill="#fff" />
                <text x="180" y="152" fill="#f87171" font-size="9" font-family="monospace">Off Route (+140m)</text>
              ` : `
                <!-- Current user location beacon on safe path -->
                <circle cx="150" cy="75" r="10" fill="rgba(139, 92, 246, 0.3)" class="animate-pulse" />
                <circle cx="150" cy="75" r="6" fill="#a855f7" stroke="#fff" stroke-width="2" />
                <text x="135" y="60" fill="#c084fc" font-size="9" font-family="sans-serif" font-weight="bold">Payal</text>
              `}

              <!-- Origin Point -->
              <circle cx="30" cy="130" r="5" fill="#64748b" />
              <text x="15" y="150" fill="#94a3b8" font-size="8" font-family="sans-serif">Library</text>

              <!-- Safe Haven Point along route -->
              <circle cx="105" cy="115" r="4" fill="#06b6d4" />
              <text x="75" y="105" fill="#38bdf8" font-size="8" font-family="sans-serif">Police Kiosk</text>

              <!-- Destination Point -->
              <circle cx="270" cy="30" r="6" fill="#10b981" />
              <text x="235" y="20" fill="#34d399" font-size="8" font-family="sans-serif" font-weight="bold">Hostel</text>
            </svg>
          </div>
        </div>

        <!-- Journey Telemetry Card -->
        <div class="glass-panel p-3.5 rounded-2xl space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] text-slate-400 uppercase font-mono">Current Trip</p>
              <h3 class="text-sm font-bold text-white">${j.title}</h3>
            </div>
            <span class="text-xs font-mono font-bold text-purple-300">${j.eta}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <span class="text-slate-400">Origin:</span>
              <p class="text-slate-200 font-semibold truncate">${j.origin}</p>
            </div>
            <div class="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <span class="text-slate-400">Destination:</span>
              <p class="text-slate-200 font-semibold truncate">${j.destination}</p>
            </div>
          </div>

          <!-- Safe Havens List -->
          <div>
            <p class="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <i data-lucide="shield" class="w-3.5 h-3.5 text-cyan-400"></i>
              Active Safe Havens Along Route
            </p>
            <div class="space-y-1.5 text-[10px]">
              ${j.safeZones.map(sz => `
                <div class="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span class="text-slate-200">${sz.name}</span>
                  <span class="text-cyan-400 font-mono font-semibold">${sz.distance}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 flex gap-2">
        <button id="btn-toggle-route-dev" class="flex-1 py-3 px-3 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-600/40 text-purple-200 font-semibold text-xs transition">
          ${l.inCorridor === false ? 'Reset to Safe Corridor' : 'Simulate Cab Deviation'}
        </button>
        <button id="btn-journey-home" class="py-3 px-4 rounded-xl glass-panel text-white font-semibold text-xs transition">
          Dashboard
        </button>
      </div>
    </div>
  `;
}

export function attachJourneyEvents(container, app) {
  const backBtn = container.querySelector('#btn-journey-back');
  if (backBtn) backBtn.addEventListener('click', () => app.navigateTo('home'));

  const homeBtn = container.querySelector('#btn-journey-home');
  if (homeBtn) homeBtn.addEventListener('click', () => app.navigateTo('home'));

  const devBtn = container.querySelector('#btn-toggle-route-dev');
  if (devBtn) {
    devBtn.addEventListener('click', () => {
      if (app.locationSensor.inCorridor) {
        app.locationSensor.simulateDeviation(140);
      } else {
        app.locationSensor.simulateDeviation(6);
        app.signalFusion.resolveThreat();
      }
      app.navigateTo('journey');
    });
  }
}
