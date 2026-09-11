/**
 * Screen 10: Settings & Camouflage Customizer
 * Trinetra — Autonomous Safety Guardian
 */

export function renderSettingsScreen(state) {
  const s = state.settings;

  return `
    <div class="h-full flex flex-col justify-between p-5 overflow-y-auto bg-gradient-to-b from-[#050811] via-[#090e1f] to-[#04060d]">
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-purple-900/30">
        <div class="flex items-center gap-2">
          <button id="btn-settings-back" class="w-8 h-8 rounded-lg glass-panel flex items-center justify-center text-slate-300 hover:text-white">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
          <div>
            <h2 class="text-base font-bold text-white leading-tight">Guardian Settings</h2>
            <p class="text-[10px] text-purple-300 font-mono">Sensors • Privacy • Camouflage</p>
          </div>
        </div>

        <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
          v1.0.0
        </span>
      </div>

      <!-- Settings Sections -->
      <div class="flex-1 space-y-4 py-3">
        <!-- 1. CAMOUFLAGE / COVERT COVER (Poster Feature) -->
        <div class="glass-panel p-3.5 rounded-2xl border border-purple-500/30 bg-purple-950/20">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <i data-lucide="eye-off" class="w-4 h-4 text-purple-400"></i>
              <h3 class="text-xs font-bold text-white">Covert App Camouflage</h3>
            </div>
            <span class="text-[9px] text-purple-300 font-mono">Stealth Mode</span>
          </div>
          <p class="text-[10px] text-slate-400 mb-3">
            Disguises the entire application as a harmless utility if an aggressor looks at your screen.
          </p>

          <div class="grid grid-cols-2 gap-2">
            <button id="btn-cover-none" class="py-2.5 px-3 rounded-xl border ${s.camouflageMode === 'none' ? 'border-purple-400 bg-purple-600/30 font-bold text-white' : 'border-slate-800 bg-slate-900/80 text-slate-400'} text-xs flex items-center justify-center gap-1.5 transition">
              <i data-lucide="shield" class="w-3.5 h-3.5"></i>
              Default UI
            </button>
            <button id="btn-cover-calculator" class="py-2.5 px-3 rounded-xl border ${s.camouflageMode === 'calculator' ? 'border-purple-400 bg-purple-600/30 font-bold text-white' : 'border-slate-800 bg-slate-900/80 text-slate-400'} text-xs flex items-center justify-center gap-1.5 transition">
              <i data-lucide="calculator" class="w-3.5 h-3.5"></i>
              Calculator Cover
            </button>
          </div>
        </div>

        <!-- 2. SENSOR SENSITIVITY CONFIGURATION -->
        <div class="glass-panel p-3.5 rounded-2xl space-y-3">
          <h3 class="text-xs font-bold text-white flex items-center gap-2">
            <i data-lucide="sliders" class="w-4 h-4 text-cyan-400"></i>
            Sensor Sensitivity & Thresholds
          </h3>

          <!-- Voice Sensitivity -->
          <div class="space-y-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">Voice Acoustic Surge Threshold</span>
              <span class="text-purple-300 font-mono">${s.sensors.voice.thresholdDb} dB</span>
            </div>
            <input type="range" min="50" max="95" value="${s.sensors.voice.thresholdDb}" id="range-voice-db" class="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
          </div>

          <!-- Motion Fall G-Force -->
          <div class="space-y-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">Fall / Impact G-Force Threshold</span>
              <span class="text-cyan-300 font-mono">${s.sensors.motion.fallThresholdG || 22} m/s²</span>
            </div>
            <input type="range" min="15" max="35" value="${s.sensors.motion.fallThresholdG || 22}" id="range-motion-g" class="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
          </div>

          <!-- Location Deviation Tolerance -->
          <div class="space-y-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-slate-300">Route Deviation Tolerance</span>
              <span class="text-emerald-300 font-mono">${s.sensors.location.deviationToleranceMeters} meters</span>
            </div>
            <input type="range" min="40" max="150" value="${s.sensors.location.deviationToleranceMeters}" id="range-loc-dev" class="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
          </div>
        </div>

        <!-- 3. DISTRESS CODE WORDS -->
        <div class="glass-panel p-3.5 rounded-2xl space-y-2.5">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-white flex items-center gap-2">
              <i data-lucide="mic" class="w-4 h-4 text-purple-400"></i>
              Distress Code Words
            </h3>
            <button id="btn-add-codeword" class="text-[10px] text-purple-300 hover:text-purple-200 flex items-center gap-1">
              <i data-lucide="plus" class="w-3 h-3"></i> Add
            </button>
          </div>

          <div class="flex flex-wrap gap-1.5" id="codewords-container">
            ${s.codeWords.map(w => `
              <span class="px-2.5 py-1 rounded-full bg-slate-900 border border-purple-800/60 text-purple-200 text-[10px] font-mono flex items-center gap-1.5">
                "${w}"
              </span>
            `).join('')}
          </div>
        </div>

        <!-- 4. HARDWARE PERMISSIONS STATUS -->
        <div class="glass-panel p-3.5 rounded-2xl space-y-2">
          <h3 class="text-xs font-bold text-white flex items-center gap-2">
            <i data-lucide="key" class="w-4 h-4 text-amber-400"></i>
            Hardware Sensor Permissions
          </h3>
          <p class="text-[10px] text-slate-400">
            Trinetra accesses device sensors locally. Data is NEVER streamed to remote servers.
          </p>

          <button id="btn-recheck-permissions" class="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-cyan-400"></i>
            Request / Re-check Sensor Permissions
          </button>
        </div>
      </div>

      <!-- Bottom Save Button -->
      <div class="pt-2">
        <button id="btn-settings-save" class="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition">
          Save Preferences & Return
        </button>
      </div>
    </div>
  `;
}

export function attachSettingsEvents(container, app) {
  const backBtn = container.querySelector('#btn-settings-back');
  if (backBtn) backBtn.addEventListener('click', () => app.navigateTo('home'));

  const saveBtn = container.querySelector('#btn-settings-save');
  if (saveBtn) saveBtn.addEventListener('click', () => app.navigateTo('home'));

  // Camouflage Toggles
  const noneBtn = container.querySelector('#btn-cover-none');
  if (noneBtn) {
    noneBtn.addEventListener('click', () => {
      app.state.settings.camouflageMode = 'none';
      app.navigateTo('settings');
    });
  }

  const calcBtn = container.querySelector('#btn-cover-calculator');
  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      app.state.settings.camouflageMode = 'calculator';
      app.navigateTo('calculatorCover');
    });
  }

  // Sliders
  const voiceRange = container.querySelector('#range-voice-db');
  if (voiceRange) {
    voiceRange.addEventListener('input', (e) => {
      app.state.settings.sensors.voice.thresholdDb = parseInt(e.target.value);
    });
  }

  const motionRange = container.querySelector('#range-motion-g');
  if (motionRange) {
    motionRange.addEventListener('input', (e) => {
      app.state.settings.sensors.motion.fallThresholdG = parseInt(e.target.value);
    });
  }

  const locRange = container.querySelector('#range-loc-dev');
  if (locRange) {
    locRange.addEventListener('input', (e) => {
      app.state.settings.sensors.location.deviationToleranceMeters = parseInt(e.target.value);
    });
  }

  // Add Code Word
  const addWordBtn = container.querySelector('#btn-add-codeword');
  if (addWordBtn) {
    addWordBtn.addEventListener('click', () => {
      const word = prompt('Enter a new distress code word to spot in speech:');
      if (word && word.trim()) {
        const clean = word.trim().toLowerCase();
        if (!app.state.settings.codeWords.includes(clean)) {
          app.state.settings.codeWords.push(clean);
          app.voiceSensor.options.codeWords = [...app.state.settings.codeWords];
          app.navigateTo('settings');
        }
      }
    });
  }

  // Re-check permissions
  const permBtn = container.querySelector('#btn-recheck-permissions');
  if (permBtn) {
    permBtn.addEventListener('click', () => {
      app.startSensors();
      alert('Sensor authorization requested. Please check browser prompt for microphone, location, and motion.');
    });
  }
}
