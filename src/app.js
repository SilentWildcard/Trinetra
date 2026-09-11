/**
 * Trinetra — Autonomous Safety Guardian
 * Application Orchestrator, State Manager & Router
 */

import { defaultContacts, defaultJourney, defaultCircle, defaultSettings } from './mockData.js';
import { VoiceSensor } from './sensors/voiceSensor.js';
import { MotionSensor } from './sensors/motionSensor.js';
import { LocationSensor } from './sensors/locationSensor.js';
import { SignalFusionEngine } from './sensors/signalFusion.js';

// Screen Renderers
import { renderWelcomeScreen, attachWelcomeEvents } from './screens/welcome.js';
import { renderGuardianHomeScreen, attachGuardianHomeEvents } from './screens/guardianHome.js';
import { renderMonitoringScreen, attachMonitoringEvents } from './screens/monitoring.js';
import { renderThreatDetectionScreen, attachThreatDetectionEvents } from './screens/threatDetection.js';
import { renderSafetyConfirmScreen, attachSafetyConfirmEvents, clearSafetyCountdown } from './screens/safetyConfirm.js';
import { renderSilentSosScreen, attachSilentSosEvents } from './screens/silentSos.js';
import { renderEmergencyContactsScreen, attachEmergencyContactsEvents } from './screens/emergencyContacts.js';
import { renderJourneyScreen, attachJourneyEvents } from './screens/journey.js';
import { renderCircleScreen, attachCircleEvents } from './screens/circle.js';
import { renderSettingsScreen, attachSettingsEvents } from './screens/settings.js';
import { renderCalculatorCover, attachCalculatorCoverEvents } from './screens/calculatorCover.js';

// Components
import { renderBottomNav, attachBottomNavEvents } from './components/navigation.js';
import { renderDemoBar, attachDemoBarEvents } from './components/demoBar.js';

export class TrinetraApp {
  constructor() {
    this.state = {
      activeScreen: 'welcome',
      screenParams: {},
      contacts: [...defaultContacts],
      journey: { ...defaultJourney },
      circle: [...defaultCircle],
      settings: JSON.parse(JSON.stringify(defaultSettings)),
      sensors: {
        voice: { status: 'IDLE', level: 0 },
        motion: { status: 'IDLE', intensity: 0 },
        location: { status: 'IDLE', coords: { latitude: 28.5458, longitude: 77.1926 }, deviationMeters: 8, inCorridor: true }
      }
    };

    // Initialize Sensors
    this.voiceSensor = new VoiceSensor(this.state.settings.sensors.voice);
    this.motionSensor = new MotionSensor(this.state.settings.sensors.motion);
    this.locationSensor = new LocationSensor(this.state.settings.sensors.location);

    // Initialize Signal Fusion Engine
    this.signalFusion = new SignalFusionEngine();

    this._threatTimeout = null;

    this.rootContainer = document.getElementById('app-screen');
    this.bottomNavContainer = document.getElementById('bottom-nav-container');
    this.demoBarContainer = document.getElementById('demo-bar-container');

    this._setupSensors();
    this._setupAutonomousEscalation();
  }

  _setupSensors() {
    // 1. Voice Sensor Listener -> Signal Fusion
    this.voiceSensor.onUpdate((data) => {
      this.state.sensors.voice = { ...this.state.sensors.voice, ...data };
      this.signalFusion.updateVoice(data);
      this._updateSensorUI();
    });

    // 2. Motion Sensor Listener -> Signal Fusion
    this.motionSensor.onUpdate((data) => {
      this.state.sensors.motion = { ...this.state.sensors.motion, ...data };
      this.signalFusion.updateMotion(data);
      this._updateSensorUI();
    });

    // 3. Location Sensor Listener -> Signal Fusion
    this.locationSensor.onUpdate((data) => {
      this.state.sensors.location = { ...this.state.sensors.location, ...data };
      this.signalFusion.updateLocation(data);
      this._updateSensorUI();
    });

    // 4. Signal Fusion State Listener
    this.signalFusion.subscribe((engineState) => {
      this._updateDemoBarUI();
    });
  }

  _setupAutonomousEscalation() {
    // AUTONOMOUS RESPONSE PIPELINE: Threat -> "Are You Safe?" -> Silent SOS
    this.signalFusion.onThreatEscalated((threat) => {
      console.warn('Trinetra: Autonomous Threat Pipeline Escalated!', threat);

      if (this._threatTimeout) {
        clearTimeout(this._threatTimeout);
        this._threatTimeout = null;
      }

      // Step 1: Immediately transition to Threat Detection screen
      this.navigateTo('threatDetection', { autoTriggered: true });

      // Step 2: After 2.5 seconds, autonomously transition to "ARE YOU SAFE?" modal
      this._threatTimeout = setTimeout(() => {
        if (this.state.activeScreen === 'threatDetection' && this.signalFusion.state.autonomousTriggerActive) {
          this.navigateTo('safetyConfirm', { autoTriggered: true });
        }
      }, 2500);
    });
  }

  // --- SIMULATOR INJECTORS (FEEDS EXACT SAME SIGNAL FUSION ENGINE) ---

  simulateFall() {
    console.info('Trinetra Demo: Injected sudden fall & violent ground impact');
    this.motionSensor.simulatePattern('FALL');
  }

  simulateVoiceDistress(codeWord = 'bachao') {
    console.info(`Trinetra Demo: Injected voice distress code word "${codeWord}"`);
    this.voiceSensor.simulateLevel(85, codeWord);
  }

  simulateRouteDeviation(meters = 140) {
    console.info(`Trinetra Demo: Injected route corridor deviation (${meters}m)`);
    this.locationSensor.simulateDeviation(meters);
  }

  resetToSafeBaseline() {
    console.info('Trinetra Demo: Resetting all sensors and Signal Fusion to safe baseline');

    // 1. Cancel any pending threat transitions
    if (this._threatTimeout) {
      clearTimeout(this._threatTimeout);
      this._threatTimeout = null;
    }

    // 2. Clear safety confirmation countdown timer
    clearSafetyCountdown();

    // 3. Reset hardware/mock sensors
    this.voiceSensor.simulateLevel(10, null);
    this.motionSensor.simulatePattern(null);
    this.locationSensor.simulateDeviation(6);

    // 4. Resolve threat in Signal Fusion engine
    this.signalFusion.resolveThreat();

    // 5. Navigate back to Home and re-render everything
    this.navigateTo('home');
  }

  async startSensors() {
    console.info('Trinetra: Starting real browser sensor pipeline...');
    try {
      await this.voiceSensor.start();
    } catch (e) { console.warn(e); }

    try {
      await this.motionSensor.start();
    } catch (e) { console.warn(e); }

    try {
      this.locationSensor.start();
    } catch (e) { console.warn(e); }

    this.render();
  }

  navigateTo(screenId, params = {}) {
    this.state.activeScreen = screenId;
    this.state.screenParams = params;
    this.render();
  }

  render() {
    // Check if Covert Calculator Camouflage is active
    if (this.state.settings.camouflageMode === 'calculator' && this.state.activeScreen !== 'calculatorCover') {
      this.state.activeScreen = 'calculatorCover';
    }

    // Render Demo Bar on Desktop (synchronized with phone UI)
    this._updateDemoBarUI();

    const currentScreen = this.state.activeScreen;
    const engineState = this.signalFusion.state;
    let html = '';

    switch (currentScreen) {
      case 'welcome':
        html = renderWelcomeScreen(this.state);
        break;
      case 'home':
        html = renderGuardianHomeScreen(this.state, engineState);
        break;
      case 'monitoring':
        html = renderMonitoringScreen(this.state, engineState);
        break;
      case 'threatDetection':
        html = renderThreatDetectionScreen(this.state, engineState);
        break;
      case 'safetyConfirm':
        html = renderSafetyConfirmScreen(this.state, engineState);
        break;
      case 'silentSos':
        html = renderSilentSosScreen(this.state, engineState, this.state.screenParams);
        break;
      case 'contacts':
        html = renderEmergencyContactsScreen(this.state);
        break;
      case 'journey':
        html = renderJourneyScreen(this.state);
        break;
      case 'circle':
        html = renderCircleScreen(this.state);
        break;
      case 'settings':
        html = renderSettingsScreen(this.state);
        break;
      case 'calculatorCover':
        html = renderCalculatorCover();
        break;
      default:
        html = renderGuardianHomeScreen(this.state, engineState);
    }

    if (this.rootContainer) {
      this.rootContainer.innerHTML = html;
      this._attachScreenEvents(currentScreen);
    }

    // Render Bottom Nav (hidden on modal / alert / cover screens)
    const hideNavScreens = ['welcome', 'threatDetection', 'safetyConfirm', 'silentSos', 'calculatorCover'];
    if (this.bottomNavContainer) {
      if (hideNavScreens.includes(currentScreen)) {
        this.bottomNavContainer.innerHTML = '';
        this.bottomNavContainer.style.display = 'none';
      } else {
        this.bottomNavContainer.style.display = 'block';
        this.bottomNavContainer.innerHTML = renderBottomNav(currentScreen, (target) => this.navigateTo(target));
        attachBottomNavEvents(this.bottomNavContainer, (target) => this.navigateTo(target));
      }
    }

    // Re-initialize Lucide Icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  _attachScreenEvents(screenId) {
    switch (screenId) {
      case 'welcome':
        attachWelcomeEvents(this.rootContainer, this);
        break;
      case 'home':
        attachGuardianHomeEvents(this.rootContainer, this);
        break;
      case 'monitoring':
        attachMonitoringEvents(this.rootContainer, this);
        break;
      case 'threatDetection':
        attachThreatDetectionEvents(this.rootContainer, this);
        break;
      case 'safetyConfirm':
        attachSafetyConfirmEvents(this.rootContainer, this);
        break;
      case 'silentSos':
        attachSilentSosEvents(this.rootContainer, this);
        break;
      case 'contacts':
        attachEmergencyContactsEvents(this.rootContainer, this);
        break;
      case 'journey':
        attachJourneyEvents(this.rootContainer, this);
        break;
      case 'circle':
        attachCircleEvents(this.rootContainer, this);
        break;
      case 'settings':
        attachSettingsEvents(this.rootContainer, this);
        break;
      case 'calculatorCover':
        attachCalculatorCoverEvents(this.rootContainer, this);
        break;
    }
  }

  _updateDemoBarUI() {
    if (this.demoBarContainer) {
      this.demoBarContainer.innerHTML = renderDemoBar(this);
      attachDemoBarEvents(this.demoBarContainer, this);
    }
  }

  _updateSensorUI() {
    this._updateDemoBarUI();

    // If on home screen, update live badge indicators
    if (this.state.activeScreen === 'home') {
      const vEl = document.getElementById('home-voice-status');
      if (vEl) vEl.textContent = this.state.sensors.voice.codeWordDetected ? 'DISTRESS' : `${this.state.sensors.voice.level || 0} dB`;

      const mEl = document.getElementById('home-motion-status');
      if (mEl) mEl.textContent = this.state.sensors.motion.anomaly ? this.state.sensors.motion.anomaly : `${this.state.sensors.motion.intensity || 0}%`;

      const lEl = document.getElementById('home-loc-status');
      if (lEl) lEl.textContent = this.state.sensors.location.inCorridor !== false ? 'In Route' : 'Off-Route';
    }
  }
}

// Global App bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.trinetraApp = new TrinetraApp();
  window.trinetraApp.render();
});
