/**
 * Screen 4: Threat Detection Screen
 * Trinetra — Autonomous Safety Guardian
 * Displays detected anomalies across the three eyes before safety check-in.
 */

export function renderThreatDetectionScreen(state, engineState) {
  const threat = engineState.activeThreat || {
    title: 'SAFETY THREAT DETECTED',
    description: 'Multi-sensor anomaly detected: Sudden Struggle + Route Deviation',
    score: engineState.score || 85,
    level: engineState.level || 'CRITICAL',
    triggers: [
      'Violent struggle motion detected (24.2 m/s²)',
      'Off designated safe route corridor (140m deviation)'
    ],
    timestamp: new Date().toLocaleTimeString()
  };

  return `
    <div class="h-full flex flex-col justify-between p-5 relative overflow-hidden bg-gradient-to-b from-[#18050c] via-[#0e0714] to-[#050811]">
      <!-- Background Urgent Warning Glow -->
      <div class="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-rose-600/20 blur-3xl animate-pulse pointer-events-none"></div>

      <!-- Top Header -->
      <div class="flex items-center justify-between pt-1 relative z-10">
        <button id="btn-threat-back" class="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-slate-300 hover:text-white">
          <i data-lucide="arrow-left" class="w-4 h-4"></i>
        </button>
        <span class="text-[10px] font-mono px-3 py-1 rounded-full bg-rose-950 border border-rose-500/60 text-rose-300 font-bold uppercase tracking-wider animate-pulse">
          🚨 Autonomous Vigilance Alert
        </span>
        <div class="w-8"></div>
      </div>

      <!-- Center Threat Indicator -->
      <div class="flex-1 flex flex-col items-center justify-center relative z-10 text-center my-4">
        <!-- Pulsing Red Reticle -->
        <div class="relative w-44 h-44 flex items-center justify-center mb-4">
          <div class="absolute inset-0 rounded-full border-2 border-rose-500/40 animate-ping"></div>
          <div class="absolute inset-2 rounded-full border border-rose-500/60 animate-pulse-ring"></div>
          <div class="w-32 h-32 rounded-full bg-rose-950/80 border-2 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.7)] flex items-center justify-center text-rose-400">
            <i data-lucide="alert-triangle" class="w-16 h-16 animate-bounce"></i>
          </div>
        </div>

        <h2 class="text-xl font-extrabold text-white tracking-tight">
          ${threat.title}
        </h2>
        <p class="text-xs text-rose-300/90 font-mono mt-1">
          Confidence Score: <span class="font-bold text-white">${threat.score}%</span> • Risk: <span class="font-bold text-rose-400">${threat.level}</span>
        </p>

        <!-- Threat Breakdown List -->
        <div class="w-full max-w-sm mt-4 space-y-2 text-left">
          ${(threat.triggers && threat.triggers.length > 0 ? threat.triggers : [threat.description]).map(t => `
            <div class="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5">
              <i data-lucide="zap" class="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5"></i>
              <span class="text-xs text-slate-200 font-medium leading-tight">${t}</span>
            </div>
          `).join('')}
        </div>

        <p class="text-[11px] text-slate-400 mt-4 max-w-xs">
          Trinetra is preparing automated verification to prevent false alarms while keeping emergency dispatches on standby.
        </p>
      </div>

      <!-- Autonomous Response Action Buttons -->
      <div class="space-y-2.5 relative z-10">
        <button 
          id="btn-goto-are-you-safe"
          class="w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg glow-purple transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
          <i data-lucide="help-circle" class="w-4 h-4"></i>
          CHECK IN: "ARE YOU SAFE?"
        </button>

        <button 
          id="btn-threat-direct-sos"
          class="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-600/50 shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
          <i data-lucide="radio" class="w-3.5 h-3.5 text-rose-400 animate-pulse"></i>
          BYPASS CHECK-IN & TRIGGER SILENT SOS
        </button>
      </div>
    </div>
  `;
}

export function attachThreatDetectionEvents(container, app) {
  const backBtn = container.querySelector('#btn-threat-back');
  if (backBtn) backBtn.addEventListener('click', () => app.navigateTo('home'));

  const checkInBtn = container.querySelector('#btn-goto-are-you-safe');
  if (checkInBtn) checkInBtn.addEventListener('click', () => app.navigateTo('safetyConfirm'));

  const directSosBtn = container.querySelector('#btn-threat-direct-sos');
  if (directSosBtn) directSosBtn.addEventListener('click', () => app.navigateTo('silentSos'));
}
