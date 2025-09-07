# (Chennai) Teir-2 & Teir-3  GPS Bus Tracking System - Technical Implementation Guide

## Overview
This guide provides complete implementation details for creating a Teir 2 & Tier 3-focused Government GPS bus tracking system with 5 active devices operating within a 25km radius from Chennai city center.

## Chennai-Specific Configuration

### Geographic Boundaries
- **Center Point**: Chennai Central Station (13.0827°N, 80.2707°E)
- **Coverage Radius**: 25 kilometers from city center
- **Coordinate Bounds**: 
  - North: 13.2327° (Poonamallee)
  - South: 12.9327° (Tambaram)
  - East: 80.4207° (ECR)
  - West: 80.1207° (Western suburbs)

### 5 MTC Bus Routes (Real Locations)

#### Route 1: 21G - T.Nagar to Marina Beach
```javascript
{
  deviceId: "MTC_GPS_001",
  busNumber: "21G",
  route: "T.Nagar - Marina Beach",
  coordinates: { lat: 13.0418, lng: 80.2341 },
  realStops: [
    "T.Nagar Bus Stand (13.0418, 80.2341)",
    "Pondy Bazaar (13.0428, 80.2356)",
    "Luz Corner (13.0455, 80.2412)",
    "Santhome Cathedral (13.0471, 80.2651)",
    "Marina Beach (13.0487, 80.2825)"
  ],
  distance: "8.2 km",
  averageTime: "25 minutes"
}
```

#### Route 2: 27B - Anna Nagar to Guindy
```javascript
{
  deviceId: "MTC_GPS_002", 
  busNumber: "27B",
  route: "Anna Nagar - Guindy",
  coordinates: { lat: 13.0850, lng: 80.2101 },
  realStops: [
    "Anna Nagar 2nd Avenue (13.0850, 80.2101)",
    "Aminjikarai (13.0701, 80.2186)",
    "Chetpet (13.0590, 80.2298)",
    "Guindy (13.0067, 80.2206)"
  ],
  distance: "12.5 km",
  averageTime: "35 minutes"
}
```

#### Route 3: 18C - Vadapalani to Adyar
```javascript
{
  deviceId: "MTC_GPS_003",
  busNumber: "18C", 
  route: "Vadapalani - Adyar",
  coordinates: { lat: 13.0501, lng: 80.2060 },
  realStops: [
    "Vadapalani Bus Terminus (13.0501, 80.2060)",
    "Kodambakkam (13.0333, 80.2265)",
    "Nandanam (13.0243, 80.2397)",
    "Adyar (13.0007, 80.2570)"
  ],
  distance: "9.8 km",
  averageTime: "28 minutes"
}
```

#### Route 4: 5M - Velachery to Egmore  
```javascript
{
  deviceId: "MTC_GPS_004",
  busNumber: "5M",
  route: "Velachery - Egmore",
  coordinates: { lat: 12.9816, lng: 80.2201 },
  realStops: [
    "Velachery Main Road (12.9816, 80.2201)",
    "Pallikaranai (12.9442, 80.2349)",
    "Mylapore (13.0336, 80.2707)",
    "Egmore Station (13.0732, 80.2609)"
  ],
  distance: "18.3 km",
  averageTime: "42 minutes"
}
```

#### Route 5: 45B - Tambaram to Central Station
```javascript
{
  deviceId: "MTC_GPS_005",
  busNumber: "45B",
  route: "Tambaram - Central Station", 
  coordinates: { lat: 12.9249, lng: 80.1000 },
  realStops: [
    "Tambaram Sanatorium (12.9249, 80.1000)",
    "Pallavaram (12.9675, 80.1410)",
    "Airport (12.9949, 80.1796)",
    "Chennai Central (13.0827, 80.2707)"
  ],
  distance: "24.7 km", 
  averageTime: "55 minutes"
}
```

## Backend Implementation

### Chennai GPS Data Server
```javascript
// chennai-gps-server.js - Backend for Chennai MTC tracking
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const moment = require('moment-timezone');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Chennai-specific configuration
const CHENNAI_CONFIG = {
  centerLat: 13.0827,
  centerLng: 80.2707,
  maxRadius: 25, // kilometers
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  language: ['Tamil', 'English']
};

// Store Chennai MTC bus data
let chennaiBuses = new Map();
let connectedClients = [];

// Validate Chennai coordinates (within 25km radius)
function isValidChennaiCoordinate(lat, lng) {
  const distance = calculateDistance(
    CHENNAI_CONFIG.centerLat, 
    CHENNAI_CONFIG.centerLng,
    lat, 
    lng
  );
  return distance <= CHENNAI_CONFIG.maxRadius;
}

// Calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// MTC GPS update endpoint
app.post('/api/mtc/gps-update', (req, res) => {
  const { 
    deviceId, 
    busNumber, 
    latitude, 
    longitude, 
    speed, 
    heading, 
    accuracy, 
    passengers,
    batteryLevel,
    signalStrength
  } = req.body;
  
  // Validate Chennai coordinates
  if (!isValidChennaiCoordinate(latitude, longitude)) {
    return res.status(400).json({ 
      error: 'Coordinates outside Chennai 25km radius' 
    });
  }

  // Create GPS update with Chennai-specific data
  const gpsUpdate = {
    deviceId,
    busNumber,
    coordinates: { latitude, longitude },
    speed: speed || 0,
    heading: heading || 0,
    accuracy: accuracy || 0,
    passengers: passengers || 0,
    batteryLevel: batteryLevel || 0,
    signalStrength: signalStrength || 0,
    timestamp: moment().tz(CHENNAI_CONFIG.timezone).toISOString(),
    location: 'Chennai',
    distanceFromCenter: calculateDistance(
      CHENNAI_CONFIG.centerLat, 
      CHENNAI_CONFIG.centerLng,
      latitude, 
      longitude
    )
  };

  // Store bus data
  chennaiBuses.set(deviceId, gpsUpdate);

  // Broadcast to all connected clients
  io.emit('chennaiBusUpdate', gpsUpdate);
  
  console.log(`Chennai MTC Bus ${busNumber} updated:`, 
    `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);

  res.json({ 
    status: 'success', 
    message: 'Chennai MTC GPS data updated',
    location: 'Chennai',
    distanceFromCenter: `${gpsUpdate.distanceFromCenter.toFixed(2)} km`
  });
});

// Get all Chennai MTC buses
app.get('/api/mtc/buses', (req, res) => {
  const buses = Array.from(chennaiBuses.values())
    .filter(bus => bus.distanceFromCenter <= CHENNAI_CONFIG.maxRadius);
  
  res.json({
    buses,
    totalBuses: buses.length,
    location: 'Chennai',
    coverage: `${CHENNAI_CONFIG.maxRadius} km radius`,
    timezone: CHENNAI_CONFIG.timezone
  });
});

// Get specific Chennai bus route info
app.get('/api/mtc/routes/:busNumber', (req, res) => {
  const { busNumber } = req.params;
  
  // Chennai MTC route information
  const chennaiRoutes = {
    '21G': {
      route: 'T.Nagar - Marina Beach',
      routeTamil: 'டி.நகர் - மெரினா கடற்கரை',
      stops: [
        { name: 'T.Nagar Bus Stand', tamil: 'டி.நகர் பஸ் ஸ்டாண்ட்' },
        { name: 'Pondy Bazaar', tamil: 'பாண்டி பஜார்' },
        { name: 'Luz Corner', tamil: 'லூஸ் கார்னர்' },
        { name: 'Marina Beach', tamil: 'மெரினா கடற்கரை' }
      ],
      distance: '8.2 km',
      fare: '₹8',
      frequency: '10-15 minutes'
    },
    '27B': {
      route: 'Anna Nagar - Guindy',
      routeTamil: 'அண்ணா நகர் - கிண்டி',
      stops: [
        { name: 'Anna Nagar', tamil: 'அண்ணா நகர்' },
        { name: 'Aminjikarai', tamil: 'அமீன்ஜிக்கரை' },
        { name: 'Chetpet', tamil: 'செட்பேட்' },
        { name: 'Guindy', tamil: 'கிண்டி' }
      ],
      distance: '12.5 km',
      fare: '₹12',
      frequency: '8-12 minutes'
    }
  };

  const routeInfo = chennaiRoutes[busNumber];
  if (routeInfo) {
    res.json(routeInfo);
  } else {
    res.status(404).json({ error: 'Chennai MTC route not found' });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected to Chennai MTC tracker:', socket.id);
  connectedClients.push(socket.id);

  // Send current Chennai bus data to new client
  const currentBuses = Array.from(chennaiBuses.values());
  socket.emit('chennaiInitialData', {
    buses: currentBuses,
    config: CHENNAI_CONFIG,
    totalBuses: currentBuses.length
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected from Chennai tracker:', socket.id);
    connectedClients = connectedClients.filter(id => id !== socket.id);
  });

  // Handle specific Chennai bus tracking requests
  socket.on('trackChennaiBus', (busNumber) => {
    const bus = Array.from(chennaiBuses.values())
      .find(b => b.busNumber === busNumber);
    if (bus) {
      socket.emit('chennaiBusLocation', bus);
    }
  });
});

server.listen(3001, () => {
  console.log('Chennai MTC GPS Tracking Server running on port 3001');
  console.log(`Coverage: ${CHENNAI_CONFIG.maxRadius}km radius from Chennai center`);
});
```

### Chennai GPS Simulator
```javascript
// chennai-gps-simulator.js - Simulate 5 Chennai MTC buses
const axios = require('axios');
const moment = require('moment-timezone');

class ChennaiMTCSimulator {
  constructor(busNumber, deviceId, route, serverUrl = 'http://localhost:3001') {
    this.busNumber = busNumber;
    this.deviceId = deviceId;
    this.route = route;
    this.serverUrl = serverUrl;
    this.currentPosition = 0;
    this.isRunning = false;
    this.interval = null;
    this.passengers = Math.floor(Math.random() * 40) + 10;
    this.batteryLevel = 60 + Math.random() * 40; // 60-100%
  }

  // Chennai route coordinates
  getRouteCoordinates() {
    const chennaiRoutes = {
      '21G': [ // T.Nagar to Marina Beach
        { lat: 13.0418, lng: 80.2341 }, // T.Nagar
        { lat: 13.0428, lng: 80.2356 }, // Pondy Bazaar
        { lat: 13.0455, lng: 80.2412 }, // Luz Corner
        { lat: 13.0471, lng: 80.2651 }, // Santhome
        { lat: 13.0487, lng: 80.2825 }  // Marina Beach
      ],
      '27B': [ // Anna Nagar to Guindy
        { lat: 13.0850, lng: 80.2101 }, // Anna Nagar
        { lat: 13.0701, lng: 80.2186 }, // Aminjikarai
        { lat: 13.0590, lng: 80.2298 }, // Chetpet
        { lat: 13.0067, lng: 80.2206 }  // Guindy
      ],
      '18C': [ // Vadapalani to Adyar
        { lat: 13.0501, lng: 80.2060 }, // Vadapalani
        { lat: 13.0333, lng: 80.2265 }, // Kodambakkam
        { lat: 13.0243, lng: 80.2397 }, // Nandanam
        { lat: 13.0007, lng: 80.2570 }  // Adyar
      ],
      '5M': [ // Velachery to Egmore
        { lat: 12.9816, lng: 80.2201 }, // Velachery
        { lat: 12.9442, lng: 80.2349 }, // Pallikaranai
        { lat: 13.0336, lng: 80.2707 }, // Mylapore
        { lat: 13.0732, lng: 80.2609 }  // Egmore
      ],
      '45B': [ // Tambaram to Central
        { lat: 12.9249, lng: 80.1000 }, // Tambaram
        { lat: 12.9675, lng: 80.1410 }, // Pallavaram
        { lat: 12.9949, lng: 80.1796 }, // Airport
        { lat: 13.0827, lng: 80.2707 }  // Central Station
      ]
    };
    return chennaiRoutes[this.busNumber] || chennaiRoutes['21G'];
  }

  // Calculate realistic Chennai GPS data
  calculateChennaiGPS(coord1, coord2, progress) {
    const lat = coord1.lat + (coord2.lat - coord1.lat) * progress;
    const lng = coord1.lng + (coord2.lng - coord1.lng) * progress;
    
    // Add Chennai-specific GPS variations
    const accuracyVariation = (Math.random() - 0.5) * 0.0002;
    const latWithNoise = lat + accuracyVariation;
    const lngWithNoise = lng + accuracyVariation;

    // Calculate heading
    const deltaLat = coord2.lat - coord1.lat;
    const deltaLng = coord2.lng - coord1.lng;
    const heading = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);

    // Simulate Chennai traffic conditions
    const baseSpeed = 15; // Base speed for Chennai traffic
    const speedVariation = Math.random() * 20; // 0-20 km/h variation
    const speed = baseSpeed + speedVariation;

    return {
      latitude: latWithNoise,
      longitude: lngWithNoise,
      accuracy: 1.5 + Math.random() * 3, // 1.5-4.5 meter accuracy
      heading: (heading + 360) % 360,
      speed: speed,
      passengers: this.passengers + Math.floor((Math.random() - 0.5) * 6),
      batteryLevel: Math.max(20, this.batteryLevel - 0.1), // Slow battery drain
      signalStrength: 3 + Math.floor(Math.random() * 3) // 3-5 signal strength
    };
  }

  // Start Chennai MTC simulation
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    const coordinates = this.getRouteCoordinates();
    let segmentProgress = 0;
    let currentSegment = 0;

    this.interval = setInterval(async () => {
      if (currentSegment >= coordinates.length - 1) {
        currentSegment = 0;
        segmentProgress = 0;
      }

      const coord1 = coordinates[currentSegment];
      const coord2 = coordinates[currentSegment + 1];
      
      const gpsData = this.calculateChennaiGPS(coord1, coord2, segmentProgress);
      
      // Send to Chennai MTC server
      try {
        await axios.post(`${this.serverUrl}/api/mtc/gps-update`, {
          deviceId: this.deviceId,
          busNumber: this.busNumber,
          ...gpsData,
          timestamp: moment().tz('Asia/Kolkata').toISOString()
        });
        
        console.log(`Chennai MTC Bus ${this.busNumber} GPS:`, 
          `${gpsData.latitude.toFixed(6)}, ${gpsData.longitude.toFixed(6)}`);
      } catch (error) {
        console.error(`Chennai MTC Bus ${this.busNumber} GPS error:`, error.message);
      }

      segmentProgress += 0.015; // Slower movement for Chennai traffic
      if (segmentProgress >= 1) {
        segmentProgress = 0;
        currentSegment++;
      }
    }, 4000); // Update every 4 seconds for realistic Chennai timing
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
  }
}

// Start 5 Chennai MTC bus simulators
const chennaiBuses = [
  new ChennaiMTCSimulator('21G', 'MTC_GPS_001', 'T.Nagar - Marina Beach'),
  new ChennaiMTCSimulator('27B', 'MTC_GPS_002', 'Anna Nagar - Guindy'),
  new ChennaiMTCSimulator('18C', 'MTC_GPS_003', 'Vadapalani - Adyar'),
  new ChennaiMTCSimulator('5M', 'MTC_GPS_004', 'Velachery - Egmore'),
  new ChennaiMTCSimulator('45B', 'MTC_GPS_005', 'Tambaram - Central')
];

console.log('Starting Chennai MTC GPS simulators...');
chennaiBuses.forEach(bus => bus.start());

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping Chennai MTC simulators...');
  chennaiBuses.forEach(bus => bus.stop());
  process.exit(0);
});
```

## Frontend Implementation

### Chennai Map Integration
```javascript
// chennai-map.js - Chennai-specific map configuration
class ChennaiMap {
  constructor() {
    this.map = null;
    this.chennaiCenter = [13.0827, 80.2707];
    this.maxZoom = 18;
    this.minZoom = 10;
    this.defaultZoom = 12;
    this.maxBounds = [
      [12.8327, 79.9207], // Southwest
      [13.3327, 80.6207]  // Northeast
    ];
  }

  initialize() {
    // Initialize Leaflet map centered on Chennai
    this.map = L.map('chennai-map', {
      center: this.chennaiCenter,
      zoom: this.defaultZoom,
      maxBounds: this.maxBounds,
      maxBoundsViscosity: 1.0
    });

    // Add Chennai street map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | Chennai MTC',
      maxZoom: this.maxZoom,
      minZoom: this.minZoom
    }).addTo(this.map);

    // Add Chennai landmarks
    this.addChennaiLandmarks();
    
    return this.map;
  }

  addChennaiLandmarks() {
    const landmarks = [
      { name: 'Marina Beach', coords: [13.0487, 80.2825], type: 'beach' },
      { name: 'Chennai Central', coords: [13.0827, 80.2707], type: 'transport' },
      { name: 'Kapaleeshwarar Temple', coords: [13.0336, 80.2707], type: 'temple' },
      { name: 'Phoenix MarketCity', coords: [13.0501, 80.2060], type: 'shopping' }
    ];

    landmarks.forEach(landmark => {
      const icon = this.getLandmarkIcon(landmark.type);
      L.marker(landmark.coords, { icon })
        .addTo(this.map)
        .bindPopup(`<b>${landmark.name}</b><br>Chennai Landmark`);
    });
  }

  getLandmarkIcon(type) {
    const iconMap = {
      beach: '🏖️',
      transport: '🚉', 
      temple: '🛕',
      shopping: '🛍️'
    };
    
    return L.divIcon({
      html: iconMap[type] || '📍',
      className: 'chennai-landmark-icon',
      iconSize: [20, 20]
    });
  }
}
```

## Deployment Configuration

### Docker Setup for Chennai System
```dockerfile
# Dockerfile for Chennai MTC tracker
FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy Chennai-specific configuration
COPY . .

# Set Chennai timezone
ENV TZ=Asia/Kolkata

# Expose port
EXPOSE 3001

# Start Chennai MTC server
CMD ["node", "chennai-gps-server.js"]
```

### Environment Configuration
```bash
# .env for Chennai deployment
CHENNAI_CENTER_LAT=13.0827
CHENNAI_CENTER_LNG=80.2707
MAX_RADIUS_KM=25
TIMEZONE=Asia/Kolkata
CURRENCY=INR
DEFAULT_LANGUAGE=english
BACKUP_LANGUAGE=tamil
MTC_API_BASE_URL=https://mtcbus.tn.gov.in
WEATHER_API_KEY=your_weather_api_key
TRAFFIC_API_KEY=your_traffic_api_key
```

This implementation creates a comprehensive Chennai-focused MTC bus tracking system that operates entirely within the 25km radius requirement, using real Chennai coordinates and landmarks while maintaining all the advanced GPS tracking features.
