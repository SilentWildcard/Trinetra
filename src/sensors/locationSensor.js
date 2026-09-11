/**
 * Trinetra — Eye 3: Location Sensor Module
 * Real Geolocation API watchPosition + Route Corridor Deviation Calculator
 */

export class LocationSensor {
  constructor(options = {}) {
    this.options = {
      deviationThresholdMeters: 75,
      ...options
    };

    this.isActive = false;
    this.status = 'IDLE'; // 'IDLE' | 'LOCATING' | 'LOCKED' | 'PERMISSION_DENIED' | 'UNAVAILABLE'
    this.watchId = null;

    this.coords = {
      latitude: 28.5458,
      longitude: 77.1926,
      accuracy: 12,
      speed: 1.2, // m/s
      heading: 45,
      timestamp: Date.now()
    };

    this.deviationMeters = 8;
    this.inCorridor = true;
    this.lastAnomalyType = null; // 'ROUTE_DEVIATION' | 'UNUSUAL_STOPPAGE' | null
    this.lastAnomalyTimestamp = null;

    // Default safe corridor polyline
    this.corridorPoints = [
      { lat: 28.5458, lng: 77.1926 },
      { lat: 28.5492, lng: 77.1985 },
      { lat: 28.5531, lng: 77.2043 },
      { lat: 28.5589, lng: 77.2081 }
    ];

    this.listeners = [];
  }

  onUpdate(callback) {
    this.listeners.push(callback);
  }

  notify(data = {}) {
    this.listeners.forEach(cb => cb({
      type: 'location',
      status: this.status,
      coords: this.coords,
      deviationMeters: this.deviationMeters,
      inCorridor: this.inCorridor,
      anomaly: this.lastAnomalyType,
      lastAnomalyType: this.lastAnomalyType,
      lastAnomalyTimestamp: this.lastAnomalyTimestamp,
      ...data
    }));
  }

  start() {
    if (this.isActive) return;

    if (!navigator.geolocation) {
      this.status = 'UNAVAILABLE';
      this.notify();
      return;
    }

    this.status = 'LOCATING';
    this.isActive = true;
    this.notify();

    const geoOptions = {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 10000
    };

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.status = 'LOCKED';
        this.coords = {
          latitude: parseFloat(pos.coords.latitude.toFixed(5)),
          longitude: parseFloat(pos.coords.longitude.toFixed(5)),
          accuracy: Math.round(pos.coords.accuracy || 10),
          speed: pos.coords.speed !== null ? parseFloat((pos.coords.speed * 3.6).toFixed(1)) : 4.5, // km/h
          heading: pos.coords.heading || 0,
          timestamp: pos.timestamp
        };

        this._calculateRouteDeviation(this.coords.latitude, this.coords.longitude);
        this.notify();
      },
      (err) => {
        console.warn('Geolocation sensor notice:', err.message);
        this.status = err.code === 1 ? 'PERMISSION_DENIED' : 'UNAVAILABLE';
        this.notify({ error: err.message });
      },
      geoOptions
    );
  }

  _calculateRouteDeviation(lat, lng) {
    let minDistance = Infinity;

    for (const pt of this.corridorPoints) {
      const d = this._haversineDistance(lat, lng, pt.lat, pt.lng);
      if (d < minDistance) minDistance = d;
    }

    this.deviationMeters = Math.round(minDistance);
    this.inCorridor = this.deviationMeters <= this.options.deviationThresholdMeters;

    if (!this.inCorridor) {
      this.lastAnomalyType = 'ROUTE_DEVIATION';
      this.lastAnomalyTimestamp = Date.now();
      this.notify({
        anomaly: 'ROUTE_DEVIATION',
        highPriority: true,
        deviationMeters: this.deviationMeters
      });
    } else {
      this.lastAnomalyType = null;
    }
  }

  _haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  stop() {
    this.isActive = false;
    this.status = 'IDLE';
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.notify();
  }

  // Simulation controls for demo flow
  simulateDeviation(meters) {
    this.deviationMeters = Math.round(meters);
    this.inCorridor = this.deviationMeters <= this.options.deviationThresholdMeters;
    this.status = 'LOCKED';
    if (!this.inCorridor) {
      this.lastAnomalyType = 'ROUTE_DEVIATION';
      this.lastAnomalyTimestamp = Date.now();
    } else {
      this.lastAnomalyType = null;
    }

    this.notify({
      anomaly: this.lastAnomalyType,
      deviationMeters: this.deviationMeters,
      inCorridor: this.inCorridor,
      highPriority: Boolean(this.lastAnomalyType),
      simulated: true
    });
  }
}
