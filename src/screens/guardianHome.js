/**
 * Screen 2: Guardian / Home Screen
 * Trinetra — Autonomous Safety Guardian
 * Faithful to Google Stitch UI/UX design and hackathon poster specification.
 */

export function renderGuardianHomeScreen(state, engineState) {
  const risk = engineState.level || 'NORMAL';
  const score = engineState.score || 12;

  // Colors according to risk level
  const riskColorMap = {
    NORMAL: { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]', label: 'LOW' },
    ELEVATED: { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]', label: 'MEDIUM' },
    HIGH: { text: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]', label: 'HIGH' },
    CRITICAL: { text: 'text-rose-400', bg: 'bg-rose-500/25', border: 'border-rose-500/60', glow: 'shadow-[0_0_25px_rgba(244,63,94,0.6)]', label: 'CRITICAL' }
  };
  const currentTheme = riskColorMap[risk] || riskColorMap.NORMAL;

  return `
    <div class="h-full flex flex-col justify-between p-5 relative overflow-hidden bg-gradient-to-b from-[#050811] via-[#090e1f] to-[#04060d]">
      <!-- Top App Bar -->
      <div class="flex items-center justify-between pt-1 relative z-10">
        <button id="btn-home-menu" class="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white transition">
          <i data-lucide="menu" class="w-5 h-5"></i>
        </button>

        <div class="flex flex-col items-center">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]"></span>
            <span class="text-sm font-bold tracking-wider text-white">TRIN<span class="text-purple-400">E</span>TRA</span>
          </div>
          <span class="text-[9px] text-purple-300/70 tracking-widest uppercase font-mono">Autonomous Guardian</span>
        </div>

        <button id="btn-home-alerts" class="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white relative transition">
          <i data-lucide="bell" class="w-5 h-5"></i>
          ${risk !== 'NORMAL' ? '<span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>' : ''}
        </button>
      </div>

      <!-- Protection Status Banner -->
      <div class="flex justify-center my-1 relative z-10">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentTheme.bg} border ${currentTheme.border} ${currentTheme.glow}">
          <i data-lucide="shield-check" class="w-4 h-4 ${currentTheme.text}"></i>
          <span class="text-xs font-semibold tracking-wide ${currentTheme.text} uppercase">
            ${risk === 'NORMAL' ? 'YOU ARE PROTECTED' : `ELEVATED THREAT: ${risk}`}
          </span>
        </div>
      </div>

      <!-- Centerpiece: Concentric Eye Reticle -->
      <div class="flex-1 flex flex-col items-center justify-center relative z-10 my-2">
        <div class="relative w-52 h-52 flex items-center justify-center cursor-pointer" id="btn-inspect-telemetry" title="Tap to view live telemetry">
          <!-- Concentric Ring Visuals -->
          <div class="absolute inset-0 rounded-full border border-purple-500/25 animate-pulse-ring"></div>
          <div class="absolute inset-4 rounded-full border border-dashed border-purple-400/40 animate-radar"></div>
          <div class="absolute inset-8 rounded-full border border-cyan-500/30"></div>

          <!-- Radar Crosshairs -->
          <div class="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <div class="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"></div>

          <!-- Central Trinetra Eye Artwork -->
          <div class="relative w-36 h-36 rounded-full overflow-hidden border-2 ${currentTheme.border} ${currentTheme.glow} bg-black/90 flex items-center justify-center animate-eye-breathe">
            <img src="assets/trinetra-eye.png" alt="Trinetra Eye" class="w-full h-full object-cover" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\' fill=\'%23a855f7\'><polygon points=\'50,15 90,85 10,85\' stroke=\'%23c084fc\' stroke-width=\'4\' fill=\'none\'/><circle cx=\'50\' cy=\'55\' r=\'18\' fill=\'%238b5cf6\'/></svg>'" />
          </div>

          <!-- Live Score Floating Tag -->
          <div class="absolute -bottom-2 bg-slate-950/90 border border-purple-500/50 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${currentTheme.text} shadow-lg">
            RISK: ${score}/100
          </div>
        </div>

        <!-- 3 Eyes Telemetry Pills (Voice, Motion, Location) -->
        <div class="grid grid-cols-3 gap-2 w-full max-w-xs mt-4">
          <div class="glass-panel p-2 rounded-xl flex items-center gap-2 cursor-pointer hover:border-purple-500/50 transition" data-nav="monitoring">
            <div class="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <i data-lucide="mic" class="w-3.5 h-3.5"></i>
            </div>
            <div class="overflow-hidden">
              <p class="text-[10px] font-semibold text-slate-200">Voice</p>
              <p class="text-[9px] text-slate-400 truncate" id="home-voice-status">${state.sensors.voice.status || 'Active'}</p>
            </div>
          </div>

          <div class="glass-panel p-2 rounded-xl flex items-center gap-2 cursor-pointer hover:border-cyan-500/50 transition" data-nav="monitoring">
            <div class="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <i data-lucide="smartphone" class="w-3.5 h-3.5"></i>
            </div>
            <div class="overflow-hidden">
              <p class="text-[10px] font-semibold text-slate-200">Motion</p>
              <p class="text-[9px] text-slate-400 truncate" id="home-motion-status">${state.sensors.motion.status || 'Active'}</p>
            </div>
          </div>

          <div class="glass-panel p-2 rounded-xl flex items-center gap-2 cursor-pointer hover:border-emerald-500/50 transition" data-nav="journey">
            <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
            </div>
            <div class="overflow-hidden">
              <p class="text-[10px] font-semibold text-slate-200">Location</p>
              <p class="text-[9px] text-slate-400 truncate" id="home-loc-status">${state.sensors.location.status || 'Safe'}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Risk Level Slider / Dot Bar (Faithful to Stitch design) -->
      <div class="glass-panel rounded-2xl p-3 my-2 relative z-10 flex flex-col items-center">
        <span class="text-[10px] tracking-wider text-slate-400 uppercase font-medium">Current Risk Level</span>
        <span class="text-base font-bold ${currentTheme.text} tracking-wide mt-0.5">${currentTheme.label}</span>
        
        <!-- 4-Stage Meter: LOW • MEDIUM • HIGH • CRITICAL -->
        <div class="w-full max-w-[280px] flex items-center justify-between mt-2 relative">
          <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full"></div>
          <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" 
               style="width: ${Math.min(100, Math.max(5, score))}%;"></div>

          <!-- 4 Indicator Nodes -->
          <div class="flex flex-col items-center z-10">
            <span class="w-3 h-3 rounded-full border-2 ${risk === 'NORMAL' ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#10b981]' : 'bg-slate-900 border-slate-700'}"></span>
            <span class="text-[8px] mt-1 ${risk === 'NORMAL' ? 'text-emerald-300 font-bold' : 'text-slate-500'}">LOW</span>
          </div>
          <div class="flex flex-col items-center z-10">
            <span class="w-3 h-3 rounded-full border-2 ${risk === 'ELEVATED' ? 'bg-amber-400 border-amber-200 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-900 border-slate-700'}"></span>
            <span class="text-[8px] mt-1 ${risk === 'ELEVATED' ? 'text-amber-300 font-bold' : 'text-slate-500'}">MEDIUM</span>
          </div>
          <div class="flex flex-col items-center z-10">
            <span class="w-3 h-3 rounded-full border-2 ${risk === 'HIGH' ? 'bg-orange-400 border-orange-200 shadow-[0_0_8px_#f97316]' : 'bg-slate-900 border-slate-700'}"></span>
            <span class="text-[8px] mt-1 ${risk === 'HIGH' ? 'text-orange-300 font-bold' : 'text-slate-500'}">HIGH</span>
          </div>
          <div class="flex flex-col items-center z-10">
            <span class="w-3 h-3 rounded-full border-2 ${risk === 'CRITICAL' ? 'bg-rose-500 border-rose-200 shadow-[0_0_10px_#ef4444]' : 'bg-slate-900 border-slate-700'}"></span>
            <span class="text-[8px] mt-1 ${risk === 'CRITICAL' ? 'text-rose-400 font-bold' : 'text-slate-500'}">CRITICAL</span>
          </div>
        </div>

        <p class="text-[10px] text-slate-300 mt-2 text-center truncate max-w-[290px]">
          ${engineState.summary || 'All systems normal'}
        </p>
      </div>

      <!-- Silent SOS Trigger Button (Long press or tap) -->
      <div class="my-1 relative z-10">
        <button 
          id="btn-silent-sos"
          class="w-full py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-purple-900/90 via-purple-700 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white border border-purple-400/50 shadow-lg glow-purple-sm transition-all flex items-center justify-center gap-3 relative overflow-hidden active:scale-[0.98]">
          <!-- EKG wave pulse decor -->
          <span class="text-purple-300/60 font-mono text-xs hidden sm:inline">---/\_/\---</span>
          <div class="flex flex-col items-center leading-none">
            <span class="text-sm text-purple-100 flex items-center gap-1.5">
              <i data-lucide="radio" class="w-4 h-4 text-purple-300 animate-pulse"></i>
              SILENT SOS
            </span>
            <span class="text-[9px] text-purple-300/80 font-normal mt-0.5">Press to trigger covert alert</span>
          </div>
          <span class="text-purple-300/60 font-mono text-xs hidden sm:inline">---/\_/\---</span>
        </button>
      </div>

      <!-- 3 Quick Action Buttons: Live Location, Trusted Contacts, Evidence Vault -->
      <div class="grid grid-cols-3 gap-2 relative z-10 pt-1">
        <button data-nav="journey" class="glass-panel p-2 rounded-xl flex flex-col items-center text-center hover:bg-slate-800/60 transition">
          <i data-lucide="navigation" class="w-4 h-4 text-cyan-400 mb-1"></i>
          <span class="text-[10px] font-medium text-slate-200">Live Location</span>
        </button>
        <button data-nav="contacts" class="glass-panel p-2 rounded-xl flex flex-col items-center text-center hover:bg-slate-800/60 transition">
          <i data-lucide="shield" class="w-4 h-4 text-purple-400 mb-1"></i>
          <span class="text-[10px] font-medium text-slate-200">Trusted Contacts</span>
        </button>
        <button data-nav="settings" class="glass-panel p-2 rounded-xl flex flex-col items-center text-center hover:bg-slate-800/60 transition">
          <i data-lucide="lock" class="w-4 h-4 text-emerald-400 mb-1"></i>
          <span class="text-[10px] font-medium text-slate-200">Evidence Vault</span>
        </button>
      </div>
    </div>
  `;
}

export function attachGuardianHomeEvents(container, app) {
  // Silent SOS trigger
  const sosBtn = container.querySelector('#btn-silent-sos');
  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      app.navigateTo('silentSos');
    });
  }

  // Inspect telemetry on eye tap
  const eyeBtn = container.querySelector('#btn-inspect-telemetry');
  if (eyeBtn) {
    eyeBtn.addEventListener('click', () => {
      app.navigateTo('monitoring');
    });
  }

  // Menu button goes to settings
  const menuBtn = container.querySelector('#btn-home-menu');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      app.navigateTo('settings');
    });
  }

  // Bell goes to threat detection / alerts
  const bellBtn = container.querySelector('#btn-home-alerts');
  if (bellBtn) {
    bellBtn.addEventListener('click', () => {
      app.navigateTo('threatDetection');
    });
  }

  // Nav cards
  container.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav');
      if (target) app.navigateTo(target);
    });
  });
}
