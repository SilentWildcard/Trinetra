/**
 * Trinetra — Eye 1: Voice Sensor Module
 * Real Web Audio API Analyser + Web SpeechRecognition (Speech-to-Text)
 * Operates strictly on-device for user privacy.
 */

export class VoiceSensor {
  constructor(options = {}) {
    this.options = {
      thresholdDb: 72,
      codeWords: ['bachao', 'help', 'chodo', 'danger', 'save me', 'trinetra'],
      ...options
    };

    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.speechRecognizer = null;

    this.isActive = false;
    this.status = 'IDLE'; // 'IDLE' | 'LISTENING' | 'PERMISSION_DENIED' | 'UNSUPPORTED'
    this.currentLevel = 0; // 0 to 100 dB/RMS scale
    this.lastDetectedWord = null;
    this.lastDistressTimestamp = null;

    this.listeners = [];
    this._rafId = null;
  }

  onUpdate(callback) {
    this.listeners.push(callback);
  }

  notify(data = {}) {
    this.listeners.forEach(cb => cb({
      type: 'voice',
      status: this.status,
      level: this.currentLevel,
      lastDetectedWord: this.lastDetectedWord,
      codeWordDetected: this.lastDetectedWord,
      lastDistressTimestamp: this.lastDistressTimestamp,
      ...data
    }));
  }

  async start() {
    if (this.isActive) return;

    // 1. Setup Web Audio API for Volume & Acoustic Energy
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.status = 'UNSUPPORTED';
        this.notify();
        return;
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      this.status = 'LISTENING';
      this.isActive = true;
      this._pollAudio();

      // 2. Setup Speech Recognition if supported
      this._initSpeechRecognition();

    } catch (err) {
      console.warn('Trinetra Voice Sensor: Microphone permission denied or failed:', err);
      this.status = err.name === 'NotAllowedError' ? 'PERMISSION_DENIED' : 'UNAVAILABLE';
      this.isActive = false;
      this.notify({ error: err.message });
    }
  }

  _pollAudio() {
    if (!this.isActive || !this.analyser) return;

    const buffer = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(buffer);

    // Calculate Root Mean Square (RMS) energy
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / buffer.length);
    const normalized = Math.min(100, Math.round((rms / 128) * 100));
    this.currentLevel = normalized;

    // Acoustic spike detection
    let acousticSpike = false;
    if (normalized > this.options.thresholdDb) {
      acousticSpike = true;
      this.lastDistressTimestamp = Date.now();
    }

    this.notify({ acousticSpike, rawRms: normalized });

    this._rafId = requestAnimationFrame(() => this._pollAudio());
  }

  _initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.info('Trinetra Voice: Browser speech recognition not supported; acoustic volume analysis active.');
      return;
    }

    try {
      this.speechRecognizer = new SpeechRec();
      this.speechRecognizer.continuous = true;
      this.speechRecognizer.interimResults = true;
      this.speechRecognizer.lang = 'en-IN';

      this.speechRecognizer.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript.toLowerCase();
        }

        // Check against distress keywords
        for (const word of this.options.codeWords) {
          if (transcript.includes(word.toLowerCase())) {
            this.lastDetectedWord = word;
            this.lastDistressTimestamp = Date.now();
            this.notify({
              codeWordDetected: word,
              transcript: transcript.trim(),
              highPriority: true
            });
            break;
          }
        }
      };

      this.speechRecognizer.onerror = (e) => {
        if (e.error !== 'no-speech') {
          console.debug('Speech recognition non-fatal event:', e.error);
        }
      };

      this.speechRecognizer.onend = () => {
        if (this.isActive && this.speechRecognizer) {
          try { this.speechRecognizer.start(); } catch (_) {}
        }
      };

      this.speechRecognizer.start();
    } catch (e) {
      console.warn('Speech recognition init error:', e);
    }
  }

  stop() {
    this.isActive = false;
    this.status = 'IDLE';
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this.speechRecognizer) {
      try { this.speechRecognizer.stop(); } catch (_) {}
      this.speechRecognizer = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try { this.audioContext.close(); } catch (_) {}
    }
    this.notify();
  }

  // Simulation fallback for demo mode
  simulateLevel(level, detectedWord = null) {
    this.currentLevel = Math.min(100, Math.max(0, level));
    this.lastDetectedWord = detectedWord;
    if (detectedWord) {
      this.status = 'LISTENING';
      this.lastDistressTimestamp = Date.now();
      this.notify({ codeWordDetected: detectedWord, simulated: true, highPriority: true });
    } else {
      this.notify({ codeWordDetected: null, simulated: true });
    }
  }
}
