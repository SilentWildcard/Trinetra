/**
 * Screen 3: Monitoring Dashboard (Technical Multi-Sensor Telemetry)
 * Trinetra — Autonomous Safety Guardian
 * Visualizes the 3 Eyes (Voice + Motion + Location) and the Signal Fusion Engine.
 */

export function renderMonitoringScreen(state, engineState) {
  const v = state.sensors.voice;
  const m = state.sensors.motion;
  const l = state.sensors.location;
  const f = engineState.factors || { voice: {}, motion: {}, location: {} };

  return `
    <div class="h-full flex flex-col justify-between p-4 overflow-y-auto bg-gradient-to-b from-[#050811] via-[#090e1f] to-[#04060d]">
      <!-- Top Title -->
      <div class="flex items-center justify-between pb-3 border-b border-purple-900/30">
        <div class="flex items-center gap-2">
          <button id="btn-monitoring-back" class="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-slate-300 hover:text-white">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Telemetric Monitoring</h2>
            <p class="text-[10px] text-purple-300 font-mono">Signal Fusion Engine • Real-Time</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-purple-500/40 text-[10px] font-mono">
          <span class="w-2 h-2 rounded-full ${engineState.level === 'NORMAL' ? 'bg-emerald-400' : 'bg-rose-500'} animate-pulse"></span>
          <span class="text-slate-200">RISK ${engineState.score}/100</span>
        </div>
      </div>

      <div class="flex-1 space-y-3 py-3">
        <!-- EYE 1: VOICE SENSOR -->
        <div class="glass-panel p-3 rounded-xl border-l-4 border-purple-500 shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <i data-lucide="mic" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="text-xs font-bold text-white">Eye 1: Voice & Distress Acoustics</h3>
                <p class="text-[10px] text-slate-400 font-mono">Status: <span class="text-purple-300">${v.status || 'Active'}</span></p>
              </div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-800 text-purple-200">
              ${v.level || 0} dB
            </span>
          </div>

          <!-- Real-Time VU Meter Waveform Bars -->
          <div class="mt-2.5 bg-slate-950/80 rounded-lg p-2 border border-purple-900/40">
            <div class="flex items-end justify-between h-8 gap-1 px-1" id="vu-meter-bars">
              ${Array.from({ length: 24 }).map((_, i) => {
                const height = Math.min(100, Math.max(15, ((v.level || 15) * ((i % 5) + 1) * 0.4)));
                return `<div class="w-full bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t-sm transition-all duration-75" style="height: ${height}%;"></div>`;
              }).join('')}
            </div>
            <div class="flex justify-between text-[8px] font-mono text-slate-400 mt-1 px-1">
              <span>0 dB (Silence)</span>
              <span>Distress Code Words: "bachao", "help", "danger"</span>
              <span>100 dB (Scream)</span>
            </div>
          </div>

          ${v.lastDetectedWord ? `
            <div class="mt-2 p-1.5 rounded-lg bg-rose-950/50 border border-rose-500/50 flex items-center gap-2 text-[10px] text-rose-200">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-rose-400 flex-shrink-0"></i>
              <span>Word Spotted: <strong class="uppercase text-rose-300">"${v.lastDetectedWord}"</strong></span>
            </div>
          ` : ''}

          <div class="mt-2 flex gap-1.5">
            <button id="btn-sim-voice-kw" class="flex-1 py-1 px-2 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-600/30 text-[10px] text-purple-200 font-medium transition">
              Simulate "Bachao"
            </button>
            <button id="btn-sim-voice-spike" class="flex-1 py-1 px-2 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-600/30 text-[10px] text-purple-200 font-medium transition">
              Simulate Scream (85dB)
            </button>
          </div>
        </div>

        <!-- EYE 2: MOTION SENSOR -->
        <div class="glass-panel p-3 rounded-xl border-l-4 border-cyan-500 shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <i data-lucide="smartphone" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="text-xs font-bold text-white">Eye 2: Kinetic Motion & Gyro</h3>
                <p class="text-[10px] text-slate-400 font-mono">Status: <span class="text-cyan-300">${m.status || 'Active'}</span></p>
              </div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800 text-cyan-200">
              ${m.accel?.total || 9.8} m/s²
            </span>
          </div>

          <!-- Accelerometer Tri-Axis & Intensity -->
          <div class="mt-2.5 bg-slate-950/80 rounded-lg p-2 border border-cyan-900/40 space-y-1.5 font-mono text-[10px]">
            <div class="flex items-center justify-between text-slate-300">
              <span>X: ${m.accel?.x || 0.1}</span>
              <span>Y: ${m.accel?.y || 1.1}</span>
              <span>Z: ${m.accel?.z || 9.8}</span>
              <span class="text-cyan-300 font-semibold">Intensity: ${m.intensity || 12}%</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-cyan-500 to-rose-500 transition-all duration-100" style="width: ${m.intensity || 12}%;"></div>
            </div>
            <div class="flex justify-between text-[8px] text-slate-400">
              <span>Pattern: ${m.lastAnomalyType || 'Normal Motion'}</span>
              <span>Classifier: Fall & Violent Struggle</span>
            </div>
          </div>

          <div class="mt-2 flex gap-1.5">
            <button id="btn-sim-motion-fall" class="flex-1 py-1 px-2 rounded-lg bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-600/30 text-[10px] text-cyan-200 font-medium transition">
              Simulate Sudden Fall
            </button>
            <button id="btn-sim-motion-struggle" class="flex-1 py-1 px-2 rounded-lg bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-600/30 text-[10px] text-cyan-200 font-medium transition">
              Simulate Struggle
            </button>
          </div>
        </div>

        <!-- EYE 3: LOCATION & CORRIDOR -->
        <div class="glass-panel p-3 rounded-xl border-l-4 border-emerald-500 shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <i data-lucide="map-pin" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="text-xs font-bold text-white">Eye 3: Geolocation & Corridor</h3>
                <p class="text-[10px] text-slate-400 font-mono">Status: <span class="text-emerald-300">${l.status || 'Locked'}</span></p>
              </div>
            </div>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-200">
              ${l.deviationMeters || 8}m off-route
            </span>
          </div>

          <div class="mt-2.5 bg-slate-950/80 rounded-lg p-2 border border-emerald-900/40 font-mono text-[10px] space-y-1">
            <div class="flex justify-between text-slate-300">
              <span>Lat: ${l.coords?.latitude || 28.5458}</span>
              <span>Lng: ${l.coords?.longitude || 77.1926}</span>
            </div>
            <div class="flex justify-between text-slate-400 text-[9px]">
              <span>Accuracy: ±${l.coords?.accuracy || 12}m</span>
              <span class="${l.inCorridor !== false ? 'text-emerald-400' : 'text-rose-400 font-bold'}">
                ${l.inCorridor !== false ? '✓ In Safe Corridor' : '⚠ OFF CORRIDOR'}
              </span>
            </div>
          </div>

          <div class="mt-2 flex gap-1.5">
            <button id="btn-sim-loc-deviation" class="flex-1 py-1 px-2 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-600/30 text-[10px] text-emerald-200 font-medium transition">
              Simulate Route Deviation (140m)
            </button>
          </div>
        </div>

        <!-- SIGNAL FUSION BREAKDOWN CARD -->
        <div class="glass-panel p-3 rounded-xl border border-purple-500/30 bg-purple-950/20">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5">
              <i data-lucide="cpu" class="w-4 h-4 text-purple-400"></i>
              <span class="text-xs font-bold text-white">Signal Fusion Composite</span>
            </div>
            <span class="text-[10px] font-mono font-bold text-purple-300">
              ${engineState.level} (${engineState.score}/100)
            </span>
          </div>

          <div class="space-y-1 text-[10px] text-slate-300 font-mono">
            <div class="flex justify-between">
              <span>Voice Signal Contribution:</span>
              <span class="text-purple-300">+${f.voice?.score || 0} pts</span>
            </div>
            <div class="flex justify-between">
              <span>Motion Kinetic Contribution:</span>
              <span class="text-cyan-300">+${f.motion?.score || 0} pts</span>
            </div>
            <div class="flex justify-between">
              <span>Location Corridor Contribution:</span>
              <span class="text-emerald-300">+${f.location?.score || 0} pts</span>
            </div>
          </div>

          <p class="text-[9px] text-slate-400 mt-2 border-t border-purple-900/30 pt-1.5">
            ${engineState.summary}
          </p>
        </div>
      </div>

      <!-- Bottom Action to trigger threat modal directly -->
      <div class="pt-1 flex gap-2">
        <button id="btn-trigger-threat-eval" class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-1.5">
          <i data-lucide="zap" class="w-3.5 h-3.5"></i>
          Trigger Anomaly & Confirmation
        </button>
        <button id="btn-reset-sensors" class="py-2.5 px-3 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-medium transition">
          Reset
        </button>
      </div>
    </div>
  `;
}

export function attachMonitoringEvents(container, app) {
  const backBtn = container.querySelector('#btn-monitoring-back');
  if (backBtn) backBtn.addEventListener('click', () => app.navigateTo('home'));

  // Sim Voice Keyword
  const simVoiceKw = container.querySelector('#btn-sim-voice-kw');
  if (simVoiceKw) {
    simVoiceKw.addEventListener('click', () => {
      app.simulateVoiceDistress('bachao');
    });
  }

  // Sim Voice Spike
  const simVoiceSpike = container.querySelector('#btn-sim-voice-spike');
  if (simVoiceSpike) {
    simVoiceSpike.addEventListener('click', () => {
      app.voiceSensor.simulateLevel(88);
    });
  }

  // Sim Motion Fall
  const simMotionFall = container.querySelector('#btn-sim-motion-fall');
  if (simMotionFall) {
    simMotionFall.addEventListener('click', () => {
      app.simulateFall();
    });
  }

  // Sim Motion Struggle
  const simMotionStruggle = container.querySelector('#btn-sim-motion-struggle');
  if (simMotionStruggle) {
    simMotionStruggle.addEventListener('click', () => {
      app.motionSensor.simulatePattern('STRUGGLE');
    });
  }

  // Sim Route Deviation
  const simLocDev = container.querySelector('#btn-sim-loc-deviation');
  if (simLocDev) {
    simLocDev.addEventListener('click', () => {
      app.simulateRouteDeviation(140);
    });
  }

  // Trigger Threat Evaluation
  const triggerThreat = container.querySelector('#btn-trigger-threat-eval');
  if (triggerThreat) {
    triggerThreat.addEventListener('click', () => {
      app.signalFusion.triggerThreatScenario('FULL_CRITICAL');
    });
  }

  // Reset
  const resetBtn = container.querySelector('#btn-reset-sensors');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      app.resetToSafeBaseline();
    });
  }
}
