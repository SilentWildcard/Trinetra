/**
 * Camouflage Cover: Disguised Calculator Mode
 * Trinetra — Autonomous Safety Guardian
 * Disguises the app from attackers. Entering "9999=" or pressing "C" unmasks Trinetra!
 */

export function renderCalculatorCover() {
  return `
    <div class="h-full flex flex-col justify-between p-4 bg-[#121212] text-white select-none">
      <!-- Covert Hint Bar -->
      <div class="flex items-center justify-between text-[10px] text-zinc-500 font-mono px-2 pt-1">
        <span>Standard Calculator</span>
        <button id="btn-unmask-secret" class="text-zinc-600 hover:text-purple-400 transition" title="Tap or type 9999= to unmask">
          [Cover Active]
        </button>
      </div>

      <!-- Calculator Display -->
      <div class="flex-1 flex flex-col justify-end items-end p-4 mb-2">
        <span id="calc-history" class="text-sm font-mono text-zinc-400 h-6"></span>
        <span id="calc-display" class="text-5xl font-light font-mono tracking-tight text-white mt-1">0</span>
      </div>

      <!-- Calculator Keypad -->
      <div class="grid grid-cols-4 gap-2.5 pb-4">
        <button data-calc="C" class="h-16 rounded-full bg-zinc-700 text-xl font-medium active:bg-zinc-600">C</button>
        <button data-calc="+/-" class="h-16 rounded-full bg-zinc-700 text-xl font-medium active:bg-zinc-600">±</button>
        <button data-calc="%" class="h-16 rounded-full bg-zinc-700 text-xl font-medium active:bg-zinc-600">%</button>
        <button data-calc="/" class="h-16 rounded-full bg-amber-600 text-2xl font-medium active:bg-amber-500">÷</button>

        <button data-calc="7" class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">7</button>
        <button data-calc="8" class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">8</button>
        <button data-calc="9" class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">9</button>
        <button data-calc="*" class="h-16 rounded-full bg-amber-600 text-2xl font-medium active:bg-amber-500">×</button>

        <button data-calc="4" class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">4</button>
        <button data-calc="5" class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">5</button>
        <button data-calc="6" class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">6</button>
        <button data-calc="-" class="h-16 rounded-full bg-amber-600 text-2xl font-medium active:bg-amber-500">−</button>

        <button data-calc="1" class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">1</button>
        <button data-calc="2" class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">2</button>
        <button data-calc="3" class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">3</button>
        <button data-calc="+" class="h-16 rounded-full bg-amber-600 text-2xl font-medium active:bg-amber-500">+</button>

        <button data-calc="0" class="col-span-2 h-16 rounded-full bg-zinc-800 text-2xl font-normal text-left pl-7 active:bg-zinc-700">0</button>
        <button data-calc="." class="h-16 rounded-full bg-zinc-800 text-2xl font-normal active:bg-zinc-700">.</button>
        <button data-calc="=" class="h-16 rounded-full bg-amber-600 text-2xl font-medium active:bg-amber-500">=</button>
      </div>

      <p class="text-[9px] text-zinc-600 text-center font-mono">
        Trinetra guardian runs invisibly in background. Type 9999= to reveal.
      </p>
    </div>
  `;
}

export function attachCalculatorCoverEvents(container, app) {
  let expr = '';
  const display = container.querySelector('#calc-display');
  const history = container.querySelector('#calc-history');

  container.querySelectorAll('[data-calc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-calc');

      if (val === 'C') {
        expr = '';
        display.textContent = '0';
        history.textContent = '';
      } else if (val === '=') {
        // Secret Unmask Code!
        if (expr === '9999') {
          app.state.settings.camouflageMode = 'none';
          app.navigateTo('home');
          return;
        }

        try {
          // Safe eval calculation
          const sanitized = expr.replace(/[^0-9+\-*/.]/g, '');
          const result = Function('"use strict";return (' + sanitized + ')')();
          history.textContent = expr + ' =';
          display.textContent = String(result).slice(0, 9);
          expr = String(result);
        } catch (_) {
          display.textContent = 'Error';
          expr = '';
        }
      } else {
        if (display.textContent === '0' && !isNaN(val)) {
          expr = val;
        } else {
          expr += val;
        }
        display.textContent = expr.slice(-9);
      }
    });
  });

  // Direct secret click
  const secretBtn = container.querySelector('#btn-unmask-secret');
  if (secretBtn) {
    secretBtn.addEventListener('click', () => {
      app.state.settings.camouflageMode = 'none';
      app.navigateTo('home');
    });
  }
}
