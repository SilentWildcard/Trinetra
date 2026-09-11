/**
 * Trinetra — Signal Fusion Risk Engine
 * Fuses telemetry from Eye 1 (Voice), Eye 2 (Motion), and Eye 3 (Location)
 * Calculates multi-modal risk score (0 - 100) and triggers autonomous escalation.
 */

export class SignalFusionEngine {
  constructor(options = {}) {
    this.options = {
      escalationThreshold: 60, // Risk >= 60 triggers autonomous threat escalation
      criticalThreshold: 80,
      ...options
    };

    this.state = {
      score: 12,
      level: 'NORMAL', // 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL'
      summary: 'All three eyes vigilant. Ambient parameters normal.',
      factors: {
        voice: { score: 4, reason: 'Ambient conversational noise' },
        motion: { score: 5, reason: 'Natural walking gait' },
        location: { score: 3, reason: 'Within verified safe corridor' }
      },
      activeThreat: null,
      lastThreatTimestamp: null,
      autonomousTriggerActive: false
    };

    // Telemetry cache
    this.latestVoice = { level: 10, codeWord: null, spike: false };
    this.latestMotion = { intensity: 10, anomaly: null };
    this.latestLocation = { deviationMeters: 5, inCorridor: true, anomaly: null };

    this.subscribers = [];
    this.threatEscalationCallbacks = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.state);
  }

  onThreatEscalated(callback) {
    this.threatEscalationCallbacks.push(callback);
  }

  _notify() {
    this.subscribers.forEach(cb => cb(this.state));
  }

  updateVoice(data) {
    if (data.level !== undefined) this.latestVoice.level = data.level;
    if (data.codeWordDetected !== undefined) this.latestVoice.codeWord = data.codeWordDetected;
    if (data.acousticSpike !== undefined) this.latestVoice.spike = data.acousticSpike;
    this.evaluate();
  }

  updateMotion(data) {
    if (data.intensity !== undefined) this.latestMotion.intensity = data.intensity;
    if (data.anomaly !== undefined) this.latestMotion.anomaly = data.anomaly;
    this.evaluate();
  }

  updateLocation(data) {
    if (data.deviationMeters !== undefined) this.latestLocation.deviationMeters = data.deviationMeters;
    if (data.inCorridor !== undefined) this.latestLocation.inCorridor = data.inCorridor;
    if (data.anomaly !== undefined) this.latestLocation.anomaly = data.anomaly;
    this.evaluate();
  }

  /**
   * Evaluates the fused signals to compute 0 - 100 risk score
   */
  evaluate() {
    let voiceScore = 0;
    let voiceReason = 'Voice: Ambient';
    let motionScore = 0;
    let motionReason = 'Motion: Normal';
    let locScore = 0;
    let locReason = 'Location: In Corridor';

    const triggers = [];

    // 1. Voice evaluation
    if (this.latestVoice.codeWord) {
      voiceScore = 75; // Code words are definitive distress calls
      voiceReason = `Distress code word detected: "${this.latestVoice.codeWord.toUpperCase()}"`;
      triggers.push(voiceReason);
    } else if (this.latestVoice.spike || this.latestVoice.level > 75) {
      voiceScore = Math.min(45, Math.round(this.latestVoice.level * 0.5));
      voiceReason = `High acoustic surge (${this.latestVoice.level} dB)`;
      triggers.push(voiceReason);
    } else {
      voiceScore = Math.min(10, Math.round((this.latestVoice.level || 0) * 0.1));
    }

    // 2. Motion evaluation
    if (this.latestMotion.anomaly === 'STRUGGLE') {
      motionScore = 80;
      motionReason = 'Violent struggle / high-frequency oscillation detected';
      triggers.push(motionReason);
    } else if (this.latestMotion.anomaly === 'FALL') {
      motionScore = 75; // Sudden fall & hard ground impact
      motionReason = 'Sudden violent fall and ground impact detected (26.5 m/s²)';
      triggers.push(motionReason);
    } else if (this.latestMotion.anomaly === 'SUDDEN_JERK') {
      motionScore = 40;
      motionReason = 'Sudden kinetic jerk / abrupt momentum shift';
      triggers.push(motionReason);
    } else {
      motionScore = Math.min(10, Math.round((this.latestMotion.intensity || 0) * 0.1));
    }

    // 3. Location evaluation
    if (this.latestLocation.anomaly === 'ROUTE_DEVIATION' || this.latestLocation.inCorridor === false) {
      const dev = this.latestLocation.deviationMeters || 140;
      locScore = Math.min(75, 50 + Math.round(dev * 0.18));
      locReason = `Off safe route corridor (${dev}m deviation)`;
      triggers.push(locReason);
    } else {
      locScore = Math.min(10, Math.round((this.latestLocation.deviationMeters || 5) * 0.2));
    }

    // Fused score with multi-sensor synergy multiplier
    let baseTotal = voiceScore + motionScore + locScore;

    // If 2 or more signals detected anomalies concurrently, apply confidence synergy
    const anomalyCount = (voiceScore >= 40 ? 1 : 0) + (motionScore >= 40 ? 1 : 0) + (locScore >= 40 ? 1 : 0);
    if (anomalyCount >= 2) {
      baseTotal = Math.round(baseTotal * 1.25);
    }

    const finalScore = Math.min(100, Math.max(8, baseTotal));

    // Classify Level
    let level = 'NORMAL';
    if (finalScore >= 80) level = 'CRITICAL';
    else if (finalScore >= 60) level = 'HIGH';
    else if (finalScore >= 30) level = 'ELEVATED';
    else level = 'NORMAL';

    this.state.score = finalScore;
    this.state.level = level;
    this.state.factors = {
      voice: { score: voiceScore, reason: voiceReason },
      motion: { score: motionScore, reason: motionReason },
      location: { score: locScore, reason: locReason }
    };

    if (triggers.length > 0) {
      this.state.summary = triggers.join(' • ');
    } else {
      this.state.summary = 'All three eyes vigilant. Ambient telemetry verified.';
    }

    // Autonomous Escalation Check
    if ((level === 'HIGH' || level === 'CRITICAL') && !this.state.autonomousTriggerActive) {
      this.state.autonomousTriggerActive = true;
      this.state.activeThreat = {
        title: level === 'CRITICAL' ? 'CRITICAL DISTRESS DETECTED' : 'UNUSUAL SAFETY ANOMALY',
        description: this.state.summary,
        score: finalScore,
        level: level,
        timestamp: new Date().toLocaleTimeString(),
        triggers: [...triggers]
      };
      this.state.lastThreatTimestamp = Date.now();

      // Fire autonomous response handler!
      this.threatEscalationCallbacks.forEach(cb => cb(this.state.activeThreat));
    }

    this._notify();
  }

  /**
   * Reset risk state after user confirms "I'm Safe" or Reset
   */
  resolveThreat() {
    this.state.autonomousTriggerActive = false;
    this.state.activeThreat = null;
    this.latestVoice = { level: 10, codeWord: null, spike: false };
    this.latestMotion = { intensity: 10, anomaly: null };
    this.latestLocation = { deviationMeters: 5, inCorridor: true, anomaly: null };
    this.evaluate();
  }

  /**
   * Force threat scenario for testing
   */
  triggerThreatScenario(scenarioType) {
    if (scenarioType === 'FALL') {
      this.updateMotion({ intensity: 95, anomaly: 'FALL' });
    } else if (scenarioType === 'CODEWORD') {
      this.updateVoice({ level: 85, codeWordDetected: 'bachao' });
    } else if (scenarioType === 'DEVIATION') {
      this.updateLocation({ deviationMeters: 140, inCorridor: false, anomaly: 'ROUTE_DEVIATION' });
    } else if (scenarioType === 'FULL_CRITICAL') {
      this.updateVoice({ level: 90, codeWordDetected: 'help' });
      this.updateMotion({ intensity: 95, anomaly: 'STRUGGLE' });
      this.updateLocation({ deviationMeters: 180, inCorridor: false, anomaly: 'ROUTE_DEVIATION' });
    } else {
      this.resolveThreat();
    }
  }
}
