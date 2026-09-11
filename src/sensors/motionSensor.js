/**
 * Trinetra — Eye 2: Motion Sensor Module
 * Real DeviceMotionEvent & DeviceOrientationEvent sensor listener
 * Detects sudden movement, possible fall, and violent struggle patterns.
 */

export class MotionSensor {
  constructor(options = {}) {
    this.options = {
      fallThresholdG: 22, // m/s^2 impact spike
      freeFallDip: 3.0,   // m/s^2 freefall weightlessness
      struggleOscillations: 4,
      ...options
    };

    this.isActive = false;
    this.status = 'IDLE'; // 'IDLE' | 'ACTIVE' | 'PERMISSION_REQUIRED' | 'UNSUPPORTED' | 'DESKTOP_STATIC'
    this.accel = { x: 0.1, y: 1.1, z: 9.8, total: 9.8 };
    this.intensity = 12; // 0 - 100 scale

    // Anomaly tracking buffers
    this.history = []; // last 30 samples
    this.potentialFreeFallDetectedAt = null;
    this.lastAnomalyType = null; // 'FALL' | 'STRUGGLE' | 'SUDDEN_JERK' | null
    this.lastAnomalyTimestamp = null;

    this.listeners = [];
    this._handleMotion = this._handleMotion.bind(this);
  }

  onUpdate(callback) {
    this.listeners.push(callback);
  }

  notify(data = {}) {
    this.listeners.forEach(cb => cb({
      type: 'motion',
      status: this.status,
      accel: this.accel,
      intensity: this.intensity,
      anomaly: this.lastAnomalyType,
      lastAnomalyType: this.lastAnomalyType,
      lastAnomalyTimestamp: this.lastAnomalyTimestamp,
      ...data
    }));
  }

  async start() {
    if (this.isActive) return;

    if (!window.DeviceMotionEvent) {
      this.status = 'UNSUPPORTED';
      this.notify();
      return;
    }

    // iOS 13+ requires explicit user gesture permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') {
          this.status = 'PERMISSION_DENIED';
          this.notify();
          return;
        }
      } catch (err) {
        this.status = 'PERMISSION_DENIED';
        this.notify();
        return;
      }
    }

    try {
      window.addEventListener('devicemotion', this._handleMotion, { passive: true });
      this.isActive = true;
      this.status = 'ACTIVE';
      this.notify();

      // Check if after 2 seconds no real events fired (typical on desktop computers)
      setTimeout(() => {
        if (this.isActive && this.history.length === 0) {
          this.status = 'DESKTOP_STATIC';
          this.notify({ message: 'Desktop environment detected (no hardware accelerometer)' });
        }
      }, 2000);

    } catch (e) {
      this.status = 'UNSUPPORTED';
      this.notify();
    }
  }

  _handleMotion(event) {
    const acc = event.accelerationIncludingGravity || event.acceleration;
    if (!acc) return;

    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;
    const total = Math.sqrt(x * x + y * y + z * z);

    this.accel = { x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)), z: parseFloat(z.toFixed(2)), total: parseFloat(total.toFixed(2)) };

    // Standard gravity is ~9.8 m/s^2. Deviation indicates kinetic motion
    const kineticDeviation = Math.abs(total - 9.8);
    this.intensity = Math.min(100, Math.round(kineticDeviation * 7.5));

    const now = Date.now();
    this.history.push({ time: now, total, x, y, z });
    if (this.history.length > 30) this.history.shift();

    // 1. Fall Detection Algorithm: Freefall drop followed by violent ground impact
    if (total < this.options.freeFallDip) {
      this.potentialFreeFallDetectedAt = now;
    }

    let anomalyDetected = null;

    if (this.potentialFreeFallDetectedAt && (now - this.potentialFreeFallDetectedAt < 1000)) {
      if (total > this.options.fallThresholdG) {
        anomalyDetected = 'FALL';
        this.lastAnomalyType = 'FALL';
        this.lastAnomalyTimestamp = now;
        this.potentialFreeFallDetectedAt = null;
      }
    } else if (total > this.options.fallThresholdG + 6) {
      // Direct hard impact without clean freefall
      anomalyDetected = 'SUDDEN_JERK';
      this.lastAnomalyType = 'SUDDEN_JERK';
      this.lastAnomalyTimestamp = now;
    }

    // 2. Struggle / Violent oscillation detection
    if (!anomalyDetected && this.history.length >= 15) {
      let directionFlips = 0;
      for (let i = 2; i < this.history.length; i++) {
        const d1 = this.history[i - 1].x - this.history[i - 2].x;
        const d2 = this.history[i].x - this.history[i - 1].x;
        if (d1 * d2 < -8) { // sharp reversal of acceleration vector
          directionFlips++;
        }
      }

      if (directionFlips >= this.options.struggleOscillations && this.intensity > 50) {
        anomalyDetected = 'STRUGGLE';
        this.lastAnomalyType = 'STRUGGLE';
        this.lastAnomalyTimestamp = now;
      }
    }

    this.notify({
      anomaly: anomalyDetected,
      highPriority: Boolean(anomalyDetected)
    });
  }

  stop() {
    this.isActive = false;
    this.status = 'IDLE';
    window.removeEventListener('devicemotion', this._handleMotion);
    this.notify();
  }

  // Simulation method for demo testing & desktop presentation
  simulatePattern(type) {
    const now = Date.now();
    this.lastAnomalyTimestamp = now;
    this.lastAnomalyType = type;

    if (type === 'FALL') {
      this.status = 'FALL DETECTED';
      this.accel = { x: 1.2, y: 0.8, z: 26.5, total: 26.5 };
      this.intensity = 95;
    } else if (type === 'STRUGGLE') {
      this.status = 'STRUGGLE DETECTED';
      this.accel = { x: 14.2, y: -16.4, z: 8.5, total: 22.8 };
      this.intensity = 88;
    } else if (type === 'SUDDEN_JERK') {
      this.status = 'SUDDEN JERK';
      this.accel = { x: 8.4, y: 12.1, z: 18.0, total: 23.2 };
      this.intensity = 78;
    } else {
      // Normal walking / reset
      this.status = 'ACTIVE';
      this.accel = { x: 0.1, y: 1.1, z: 9.8, total: 9.8 };
      this.intensity = 12;
      this.lastAnomalyType = null;
      this.potentialFreeFallDetectedAt = null;
    }

    this.notify({
      anomaly: this.lastAnomalyType,
      highPriority: Boolean(this.lastAnomalyType),
      simulated: true
    });
  }
}
