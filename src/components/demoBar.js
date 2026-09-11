/**
 * Trinetra — Hackathon Presentation & Sensor Simulation Toolbar
 * Enables one-click scenario testing of the core hackathon demo flow.
 * Synchronized with the phone UI state and feeds into the exact same Signal Fusion Engine!
 */

export function renderDemoBar(app) {
  const engineState = app.signalFusion.state;
  const currentScreen = app.state.activeScreen;

  const v = app.state.sensors.voice;
  const m = app.state.sensors.motion;
  const l = app.state.sensors.location;

  // Active state matching for the 6 demo steps
  const isStepActive = (step) => {
    if (step === 'welcome') return currentScreen === 'welcome';
    if (step === 'home') return currentScreen === 'home';
    if (step === 'monitoring') return currentScreen === 'monitoring';
    if (step === 'threat') return currentScreen === 'threatDetection';
    if (step === 'safetyConfirm') return currentScreen === 'safetyConfirm';
    if (step === 'silentSos') return currentScreen === 'silentSos';
    return false;
  };

  // Motion chip status text and styling
  const isFall = m.anomaly === 'FALL' || app.signalFusion.latestMotion.anomaly === 'FALL';
  const isStruggle = m.anomaly === 'STRUGGLE' || app.signalFusion.latestMotion.anomaly === 'STRUGGLE';
  const motionChipStyle = (isFall || isStruggle)
    ? 'bg-rose-950 border-rose-400 text-rose-200 font-bold shadow-[0_0_12px_#f43f5e] animate-pulse'
    : (m.status === 'ACTIVE' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400');
  const motionText = isFall ? '📱 Motion: FALL (26.5 m/s²)' : (isStruggle ? '📱 Motion: STRUGGLE' : `📱 Motion: ${m.status || 'IDLE'}`);

  // Voice chip status text and styling
  const hasWord = Boolean(v.codeWordDetected || app.signalFusion.latestVoice.codeWord);
  const voiceChipStyle = hasWord
    ? 'bg-purple-950 border-purple-400 text-purple-200 font-bold shadow-[0_0_12px_#a855f7] animate-pulse'
    : (v.status === 'LISTENING' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400');
  const voiceText = hasWord ? `🎤 Mic: "${(v.codeWordDetected || app.signalFusion.latestVoice.codeWord).toUpperCase()}"` : `🎤 Mic: ${v.status || 'IDLE'}`;

  // Location chip status text and styling
  const isDev = l.anomaly === 'ROUTE_DEVIATION' || app.signalFusion.latestLocation.anomaly === 'ROUTE_DEVIATION' || l.inCorridor === false;
  const locChipStyle = isDev
    ? 'bg-rose-950 border-rose-400 text-rose-200 font-bold shadow-[0_0_12px_#f43f5e] animate-pulse'
    : (l.status === 'LOCKED' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400');
  const locText = isDev ? `📍 GPS: OFF-ROUTE (+${l.deviationMeters || 140}m)` : `📍 GPS: ${l.status || 'IDLE'}`;

  return `
    <div id="demo-controller-bar" class="w-full max-w-4xl mx-auto mb-4 bg-slate-900/95 border border-purple-500/30 rounded-2xl p-3 shadow-2xl backdrop-blur-xl text-white select-none">
      <!-- Toolbar Header -->
      <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-900/40">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_#c084fc]"></span>
          <span class="text-xs font-black uppercase tracking-wider text-purple-200">
            Trinetra Pitch Controller & Sensor Simulator
          </span>
          <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800 text-purple-300">
            Risk: ${engineState.score}/100 [${engineState.level}]
          </span>
        </div>

        <!-- Sensor Live Status Chips -->
        <div class="flex items-center gap-1.5 text-[10px] font-mono flex-wrap">
          <span class="px-2 py-0.5 rounded-full border transition-all ${voiceChipStyle}" title="Microphone Sensor">
            ${voiceText}
          </span>
          <span class="px-2 py-0.5 rounded-full border transition-all ${motionChipStyle}" title="Motion Gyro Sensor">
            ${motionText}
          </span>
          <span class="px-2 py-0.5 rounded-full border transition-all ${locChipStyle}" title="GPS Geolocation">
            ${locText}
          </span>
        </div>
      </div>

      <!-- Demo Flow Step-by-Step Buttons (Synchronized with Phone UI) -->
      <div class="pt-2.5 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mr-1">Demo Flow:</span>
          
          <button data-flow-step="welcome" class="px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
            isStepActive('welcome')
              ? 'bg-purple-600 border-purple-300 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.7)] scale-105'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }">
            1. Welcome
          </button>
          
          <button data-flow-step="home" class="px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
            isStepActive('home')
              ? 'bg-purple-600 border-purple-300 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.7)] scale-105'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }">
            2. Guardian Home
          </button>

          <button data-flow-step="monitoring" class="px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
            isStepActive('monitoring')
              ? 'bg-purple-600 border-purple-300 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.7)] scale-105'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }">
            3. Telemetry
          </button>

          <button data-flow-step="threat" class="px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
            isStepActive('threat')
              ? 'bg-amber-500 border-amber-300 text-black font-extrabold shadow-[0_0_14px_#f59e0b] scale-105 animate-pulse'
              : 'bg-amber-950/70 hover:bg-amber-900 border-amber-600/50 text-amber-200'
          }">
            4. Threat Spike
          </button>

          <button data-flow-step="safetyConfirm" class="px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
            isStepActive('safetyConfirm')
              ? 'bg-rose-600 border-rose-300 text-white font-extrabold shadow-[0_0_16px_#f43f5e] scale-105 animate-pulse'
              : 'bg-rose-950/80 hover:bg-rose-900 border-rose-600 text-rose-200'
          }">
            5. "Are You Safe?"
          </button>

          <button data-flow-step="silentSos" class="px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
            isStepActive('silentSos')
              ? 'bg-red-700 border-red-400 text-white font-black shadow-[0_0_18px_#ef4444] scale-105 animate-pulse'
              : 'bg-rose-900 hover:bg-rose-800 border-rose-500 text-white font-medium'
          }">
            6. Silent SOS
          </button>
        </div>

        <!-- Anomaly Simulation Quick Triggers -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <button id="bar-sim-fall" class="px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all active:scale-95 ${
            isFall
              ? 'bg-cyan-500 text-black font-extrabold border-white shadow-[0_0_12px_#06b6d4]'
              : 'bg-cyan-950 hover:bg-cyan-900 border-cyan-500 text-cyan-200'
          }" title="Injects sudden fall & impact to Signal Fusion">
            ⚡ Sim Fall
          </button>

          <button id="bar-sim-voice" class="px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all active:scale-95 ${
            hasWord
              ? 'bg-purple-500 text-black font-extrabold border-white shadow-[0_0_12px_#a855f7]'
              : 'bg-purple-950 hover:bg-purple-900 border-purple-500 text-purple-200'
          }" title="Injects distress code word 'Bachao'">
            ⚡ Sim "Bachao"
          </button>

          <button id="bar-sim-dev" class="px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all active:scale-95 ${
            isDev
              ? 'bg-emerald-500 text-black font-extrabold border-white shadow-[0_0_12px_#10b981]'
              : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-500 text-emerald-200'
          }" title="Injects route deviation > 120m">
            ⚡ Sim Deviation
          </button>

          <button id="bar-reset" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[10px] font-mono text-slate-200 hover:text-white transition-all active:scale-95 shadow-sm" title="Fully resets all sensors and returns to clean Home baseline">
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  `;
}

export function attachDemoBarEvents(container, app) {
  // Demo flow buttons
  container.querySelectorAll('[data-flow-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-flow-step');
      if (step === 'threat') {
        app.signalFusion.triggerThreatScenario('FULL_CRITICAL');
      } else {
        app.navigateTo(step);
      }
    });
  });

  // Simulator buttons
  const simFall = container.querySelector('#bar-sim-fall');
  if (simFall) {
    simFall.addEventListener('click', () => {
      app.simulateFall();
    });
  }

  const simVoice = container.querySelector('#bar-sim-voice');
  if (simVoice) {
    simVoice.addEventListener('click', () => {
      app.simulateVoiceDistress('bachao');
    });
  }

  const simDev = container.querySelector('#bar-sim-dev');
  if (simDev) {
    simDev.addEventListener('click', () => {
      app.simulateRouteDeviation(140);
    });
  }

  const reset = container.querySelector('#bar-reset');
  if (reset) {
    reset.addEventListener('click', () => {
      app.resetToSafeBaseline();
    });
  }
}
