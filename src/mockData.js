/**
 * Trinetra — Autonomous Safety Guardian
 * Mock Data & Default Configuration Store
 */

export const defaultContacts = [
  {
    id: 'c1',
    name: 'Papa (Rajesh Sharma)',
    phone: '+91 98765 43210',
    relation: 'Father',
    priority: 1,
    notifySms: true,
    notifyCall: true,
    avatar: '👨‍💼',
    status: 'Ready to receive beacon'
  },
  {
    id: 'c2',
    name: 'Mom (Sunita Sharma)',
    phone: '+91 98765 12345',
    relation: 'Mother',
    priority: 2,
    notifySms: true,
    notifyCall: true,
    avatar: '👩‍💼',
    status: 'Ready to receive beacon'
  },
  {
    id: 'c3',
    name: 'Sanya (Roommate)',
    phone: '+91 98123 45678',
    relation: 'Friend',
    priority: 3,
    notifySms: true,
    notifyCall: false,
    avatar: '👩‍🎓',
    status: 'Ready to receive beacon'
  },
  {
    id: 'c4',
    name: 'Campus Security Control',
    phone: '011-2659-1000',
    relation: 'Authority',
    priority: 4,
    notifySms: true,
    notifyCall: true,
    avatar: '🛡️',
    status: 'Emergency dispatch standby'
  }
];

export const defaultJourney = {
  active: true,
  title: 'Late Evening Commute',
  origin: 'College Central Library',
  destination: 'Green Park Hostel / Residence',
  eta: '18 mins remaining',
  distance: '4.2 km',
  status: 'In Safe Corridor',
  startedAt: '09:40 PM',
  corridorDeviationMeters: 12,
  corridorThresholdMeters: 65,
  safeZones: [
    { name: 'Metro Station Gate 2 (Police Kiosk)', distance: '450m ahead', safe: true },
    { name: 'All-Night Pharmacy (Safe Haven)', distance: '1.1 km ahead', safe: true }
  ],
  routePoints: [
    { lat: 28.5458, lng: 77.1926, name: 'Campus Gate' },
    { lat: 28.5492, lng: 77.1985, name: 'Outer Ring Road' },
    { lat: 28.5531, lng: 77.2043, name: 'Hauz Khas Junction' },
    { lat: 28.5589, lng: 77.2081, name: 'Green Park Entrance' }
  ]
};

export const defaultCircle = [
  {
    id: 'u1',
    name: 'Pooja V.',
    status: 'Protected',
    battery: '82%',
    location: 'Safe • South Campus',
    lastPing: '2m ago',
    risk: 'NORMAL',
    avatar: '👩'
  },
  {
    id: 'u2',
    name: 'Aman K.',
    status: 'Protected',
    battery: '64%',
    location: 'Safe • Metro Line 3',
    lastPing: '5m ago',
    risk: 'NORMAL',
    avatar: '👨'
  },
  {
    id: 'u3',
    name: 'Rhea S.',
    status: 'Protected',
    battery: '91%',
    location: 'Safe • Home',
    lastPing: 'Just now',
    risk: 'NORMAL',
    avatar: '👩'
  }
];

export const defaultSettings = {
  protectionActive: true,
  guardianMode: 'autonomous', // 'autonomous' | 'high_alert' | 'stealth'
  camouflageMode: 'none', // 'none' | 'calculator' | 'notes'
  countdownSeconds: 15,
  codeWords: ['bachao', 'help', 'chodo', 'danger', 'save me', 'trinetra'],
  speechLanguage: 'en-IN',
  sensors: {
    voice: { enabled: true, sensitivity: 'medium', thresholdDb: 72 },
    motion: { enabled: true, sensitivity: 'high', fallThresholdG: 2.6, struggleOscillations: 4 },
    location: { enabled: true, deviationToleranceMeters: 80, geofenceAlert: true }
  },
  evidenceVault: {
    recordAudioOnSos: true,
    stealthCapture: true,
    cloudSync: false
  }
};
