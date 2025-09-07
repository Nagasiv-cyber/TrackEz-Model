// Chennai MTC GPS Bus Tracking System
class ChennaiMTCTracker {
    constructor() {
        this.mtcBuses = [];
        this.chennaiRoutes = [];
        this.chennaiLandmarks = [];
        this.alerts = [];
        this.fleetStats = {};
        this.map = null;
        this.busMarkers = {};
        this.accuracyCircles = {};
        this.routePolylines = {};
        this.landmarkMarkers = {};
        this.isTracking = true;
        this.trackingInterval = null;
        this.selectedRoute = 'all';
        this.currentLanguage = 'english';
        this.layerSettings = {
            showAccuracy: true,
            showRoutes: true,
            showLandmarks: true,
            showLabels: true
        };

        // Chennai center coordinates
        this.chennaiCenter = { lat: 13.0827, lng: 80.2707 };
        this.maxRadius = 25; // 25km radius

        this.initializeData();
        this.initializeMap();
        this.bindEvents();
        this.startRealTimeUpdates();
        this.renderBusList();
        this.renderAlerts();
        this.updateSystemStats();
    }

    initializeData() {
        // Load Chennai MTC data from provided JSON
        this.mtcBuses = [
            {
                deviceId: "MTC_GPS_001",
                busNumber: "21G",
                route: "T.Nagar - Marina Beach",
                routeTamil: "டி.நகர் - மெரினா கடற்கரை",
                driver: "Ravi Kumar",
                coordinates: {
                    lat: 13.0418,
                    lng: 80.2341,
                    accuracy: 2.8,
                    heading: 85.5,
                    speed: 24.8,
                    altitude: 8.2
                },
                deviceStatus: "online",
                batteryLevel: 87,
                signalStrength: 5,
                satellites: 8,
                currentLocation: "Pondy Bazaar, T.Nagar",
                currentLocationTamil: "பாண்டி பஜார், டி.நகர்",
                nextStop: "Panagal Park",
                nextStopTamil: "பनகல் பார்க்",
                distanceToNext: "0.8 km",
                eta: "3 min",
                passengers: 32,
                capacity: 50,
                fare: "₹8",
                lastUpdate: "2025-09-07T19:23:45+05:30"
            },
            {
                deviceId: "MTC_GPS_002", 
                busNumber: "27B",
                route: "Anna Nagar - Guindy",
                routeTamil: "அண்ணா நகர் - கிண்டி",
                driver: "Murugan S",
                coordinates: {
                    lat: 13.0850,
                    lng: 80.2101,
                    accuracy: 3.5,
                    heading: 165.2,
                    speed: 18.3,
                    altitude: 12.5
                },
                deviceStatus: "online",
                batteryLevel: 72,
                signalStrength: 4,
                satellites: 7,
                currentLocation: "Anna Nagar 2nd Avenue",
                currentLocationTamil: "அண்ணா நகர் 2வது அவென்யூ",
                nextStop: "Aminjikarai Bus Stop",
                nextStopTamil: "அமீன்ஜிக்கரை பஸ் நிறுத்தம்",
                distanceToNext: "1.2 km", 
                eta: "4 min",
                passengers: 28,
                capacity: 45,
                fare: "₹12",
                lastUpdate: "2025-09-07T19:23:42+05:30"
            },
            {
                deviceId: "MTC_GPS_003",
                busNumber: "18C",
                route: "Vadapalani - Adyar", 
                routeTamil: "வடபழனி - அடையார்",
                driver: "Sankaran P",
                coordinates: {
                    lat: 13.0501,
                    lng: 80.2060,
                    accuracy: 2.2,
                    heading: 135.8,
                    speed: 31.5,
                    altitude: 15.8
                },
                deviceStatus: "online",
                batteryLevel: 91,
                signalStrength: 5,
                satellites: 9,
                currentLocation: "Vadapalani Bus Terminus",
                currentLocationTamil: "வடபழனி பஸ் டெர்மினஸ்",
                nextStop: "Kodambakkam",
                nextStopTamil: "கோடம்பாக்கம்",
                distanceToNext: "2.1 km",
                eta: "6 min", 
                passengers: 35,
                capacity: 52,
                fare: "₹10",
                lastUpdate: "2025-09-07T19:23:40+05:30"
            },
            {
                deviceId: "MTC_GPS_004",
                busNumber: "5M",
                route: "Velachery - Egmore",
                routeTamil: "வேளச்சேரி - எழும்பூர்",
                driver: "Kumar Raja",
                coordinates: {
                    lat: 12.9816,
                    lng: 80.2201,
                    accuracy: 4.1,
                    heading: 25.3,
                    speed: 22.7,
                    altitude: 18.3
                },
                deviceStatus: "low_battery",
                batteryLevel: 28,
                signalStrength: 3,
                satellites: 6,
                currentLocation: "Velachery Main Road",
                currentLocationTamil: "வேளச்சேரி மெயின் ரோடு",
                nextStop: "Pallikaranai",
                nextStopTamil: "பள்ளிக்கரணை",
                distanceToNext: "1.8 km",
                eta: "5 min",
                passengers: 41,
                capacity: 55,
                fare: "₹15",
                lastUpdate: "2025-09-07T19:23:38+05:30"
            },
            {
                deviceId: "MTC_GPS_005",
                busNumber: "45B", 
                route: "Tambaram - Central Station",
                routeTamil: "தாம்பரம் - சென்ட்ரல் ஸ்டேஷன்",
                driver: "Krishnan M",
                coordinates: {
                    lat: 12.9249,
                    lng: 80.1000,
                    accuracy: 3.8,
                    heading: 45.7,
                    speed: 35.2,
                    altitude: 22.1
                },
                deviceStatus: "online",
                batteryLevel: 64,
                signalStrength: 4,
                satellites: 8,
                currentLocation: "Tambaram Sanatorium",
                currentLocationTamil: "தாம்பரம் சானடோரியம்",
                nextStop: "Pallavaram",
                nextStopTamil: "பல்லாவரம்",
                distanceToNext: "3.2 km",
                eta: "7 min",
                passengers: 47,
                capacity: 60,
                fare: "₹18",
                lastUpdate: "2025-09-07T19:23:35+05:30"
            }
        ];

        this.chennaiRoutes = [
            {
                routeId: "route_21g",
                busNumber: "21G",
                routeName: "T.Nagar - Marina Beach",
                routeNameTamil: "டி.நகர் - மெரினா கடற்கரை",
                color: "#FF6B35",
                deviceId: "MTC_GPS_001",
                waypoints: [
                    {lat: 13.0418, lng: 80.2341, name: "T.Nagar Bus Stand", nameTamil: "டி.நகர் பஸ் ஸ்டாண்ட்"},
                    {lat: 13.0455, lng: 80.2412, name: "Luz Corner", nameTamil: "லூஸ் கார்னர்"},
                    {lat: 13.0471, lng: 80.2651, name: "Santhome Cathedral", nameTamil: "சாந்தோம் கதீட்ரல்"},
                    {lat: 13.0487, lng: 80.2825, name: "Marina Beach", nameTamil: "மெரினா கடற்கரை"}
                ],
                totalDistance: "8.2 km",
                averageTime: "25 min"
            },
            {
                routeId: "route_27b", 
                busNumber: "27B", 
                routeName: "Anna Nagar - Guindy",
                routeNameTamil: "அண்ணா நகர் - கிண்டி",
                color: "#4CAF50",
                deviceId: "MTC_GPS_002",
                waypoints: [
                    {lat: 13.0850, lng: 80.2101, name: "Anna Nagar", nameTamil: "அண்ணா நகர்"},
                    {lat: 13.0701, lng: 80.2186, name: "Aminjikarai", nameTamil: "அமீன்ஜிக்கரை"},
                    {lat: 13.0590, lng: 80.2298, name: "Chetpet", nameTamil: "செட்பேட்"},
                    {lat: 13.0067, lng: 80.2206, name: "Guindy", nameTamil: "கிண்டி"}
                ],
                totalDistance: "12.5 km",
                averageTime: "35 min"
            },
            {
                routeId: "route_18c",
                busNumber: "18C",
                routeName: "Vadapalani - Adyar", 
                routeNameTamil: "வடபழனி - அடையார்",
                color: "#2196F3",
                deviceId: "MTC_GPS_003", 
                waypoints: [
                    {lat: 13.0501, lng: 80.2060, name: "Vadapalani", nameTamil: "வடபழனி"},
                    {lat: 13.0333, lng: 80.2265, name: "Kodambakkam", nameTamil: "கோடம்பாக்கம்"},
                    {lat: 13.0243, lng: 80.2397, name: "Nandanam", nameTamil: "நந்தனம்"},
                    {lat: 13.0007, lng: 80.2570, name: "Adyar", nameTamil: "அடையார்"}
                ],
                totalDistance: "9.8 km",
                averageTime: "28 min"
            },
            {
                routeId: "route_5m",
                busNumber: "5M",
                routeName: "Velachery - Egmore",
                routeNameTamil: "வேளச்சேரி - எழும்பூர்",
                color: "#9C27B0",
                deviceId: "MTC_GPS_004",
                waypoints: [
                    {lat: 12.9816, lng: 80.2201, name: "Velachery", nameTamil: "வேளச்சேரி"},
                    {lat: 12.9442, lng: 80.2349, name: "Pallikaranai", nameTamil: "பள்ளிக்கரணை"},
                    {lat: 13.0336, lng: 80.2707, name: "Mylapore", nameTamil: "மைலாப்பூர்"},
                    {lat: 13.0732, lng: 80.2609, name: "Egmore", nameTamil: "எழும்பூர்"}
                ],
                totalDistance: "18.3 km",
                averageTime: "42 min"
            },
            {
                routeId: "route_45b",
                busNumber: "45B", 
                routeName: "Tambaram - Central Station",
                routeNameTamil: "தாம்பரம் - சென்ட்ரல் ஸ்டேஷன்",
                color: "#FF9800",
                deviceId: "MTC_GPS_005",
                waypoints: [
                    {lat: 12.9249, lng: 80.1000, name: "Tambaram", nameTamil: "தாம்பரம்"},
                    {lat: 12.9675, lng: 80.1410, name: "Pallavaram", nameTamil: "பல்லாவரம்"},
                    {lat: 12.9949, lng: 80.1796, name: "Airport", nameTamil: "விமான நிலையம்"},
                    {lat: 13.0827, lng: 80.2707, name: "Central Station", nameTamil: "சென்ட்ரல் ஸ்டேஷன்"}
                ],
                totalDistance: "24.7 km",
                averageTime: "55 min"
            }
        ];

        this.chennaiLandmarks = [
            {name: "Marina Beach", nameTamil: "மெரினா கடற்கரை", lat: 13.0487, lng: 80.2825, type: "tourist"},
            {name: "Chennai Central", nameTamil: "சென்னை சென்ட்ரல்", lat: 13.0827, lng: 80.2707, type: "transport"},
            {name: "Kapaleeshwarar Temple", nameTamil: "கபாலீசுவரர் கோயில்", lat: 13.0336, lng: 80.2707, type: "religious"},
            {name: "Phoenix MarketCity", nameTamil: "பீனிக்ஸ் மார்க்கெட்சிட்டி", lat: 13.0501, lng: 80.2060, type: "shopping"},
            {name: "Fort St. George", nameTamil: "செயின்ட் ஜார்ஜ் கோட்டை", lat: 13.0793, lng: 80.2885, type: "historical"}
        ];

        this.alerts = [
            {
                id: "alert_chennai_001",
                deviceId: "MTC_GPS_004",
                type: "low_battery",
                message: "MTC Bus 5M requires immediate charging - battery at 28%",
                messageTamil: "எம்டிசி பஸ் 5M உடனடியாக சார்ஜ் தேவை - பேட்டரி 28%",
                severity: "warning",
                timestamp: "2025-09-07T19:20:00+05:30"
            },
            {
                id: "alert_chennai_002",
                type: "weather",
                message: "Light rain expected in Chennai - routes may experience delays",
                messageTamil: "சென்னையில் லேசான மழை எதிர்பார்க்கப்படுகிறது - பஸ் சேவையில் தாமதம் ஏற்படலாம்",
                severity: "info",
                timestamp: "2025-09-07T19:15:00+05:30"
            }
        ];

        this.fleetStats = {
            totalMTCDevices: 5,
            onlineDevices: 4,
            lowBatteryDevices: 1,
            totalPassengers: 183,
            totalCapacity: 262,
            averageAccuracy: 3.28,
            fleetUtilization: "70%"
        };
    }

    initializeMap() {
        // Initialize map centered on Chennai
        this.map = L.map('chennaiMap').setView([this.chennaiCenter.lat, this.chennaiCenter.lng], 11);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);

        // Add all MTC buses to map
        this.renderAllBuses();
        
        // Add Chennai landmarks
        if (this.layerSettings.showLandmarks) {
            this.renderLandmarks();
        }
    }

    renderAllBuses() {
        // Clear existing markers first
        Object.values(this.busMarkers).forEach(marker => {
            this.map.removeLayer(marker);
        });
        Object.values(this.accuracyCircles).forEach(circle => {
            this.map.removeLayer(circle);
        });
        this.busMarkers = {};
        this.accuracyCircles = {};

        this.mtcBuses.forEach(bus => {
            this.addBusToMap(bus);
        });

        if (this.layerSettings.showRoutes) {
            this.renderRoutes();
        }
    }

    addBusToMap(bus) {
        const { lat, lng } = bus.coordinates;

        // Create MTC bus marker based on status
        let markerColor = '#1FB8CD'; // online - teal
        if (bus.deviceStatus === 'low_battery') markerColor = '#FFC185'; // warning - orange
        if (bus.deviceStatus === 'offline') markerColor = '#B4413C'; // error - red

        // Create custom MTC bus icon
        const busIcon = L.divIcon({
            className: `bus-marker ${bus.deviceStatus}`,
            html: `<div style="
                width: 24px; 
                height: 24px; 
                border-radius: 50%; 
                background-color: ${markerColor};
                border: 3px solid white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 11px;
            ">🚌</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        // Add marker to map
        const marker = L.marker([lat, lng], { icon: busIcon }).addTo(this.map);

        // Bind popup
        marker.bindPopup(this.createBusPopup(bus));

        // Store marker reference
        this.busMarkers[bus.deviceId] = marker;

        // Add GPS accuracy circle if enabled
        if (this.layerSettings.showAccuracy) {
            const accuracyCircle = L.circle([lat, lng], {
                radius: bus.coordinates.accuracy,
                fillColor: markerColor,
                fillOpacity: 0.1,
                color: markerColor,
                weight: 1,
                dashArray: '5, 5'
            }).addTo(this.map);

            this.accuracyCircles[bus.deviceId] = accuracyCircle;
        }

        // Add click event to show bus details
        marker.on('click', () => {
            this.showBusDetails(bus);
            this.updateCoordinateDisplay(bus);
        });
    }

    createBusPopup(bus) {
        const localTime = new Date(bus.lastUpdate).toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'});
        const batteryIcon = bus.batteryLevel < 25 ? '🪫' : bus.batteryLevel < 50 ? '🔋' : '🔋';
        const signalBars = '📶'.repeat(bus.signalStrength);
        
        const routeName = this.currentLanguage === 'tamil' ? bus.routeTamil : bus.route;
        const currentLocation = this.currentLanguage === 'tamil' ? bus.currentLocationTamil : bus.currentLocation;
        const nextStop = this.currentLanguage === 'tamil' ? bus.nextStopTamil : bus.nextStop;
        
        return `
            <div style="font-family: var(--font-family-base); min-width: 220px;">
                <h4 style="margin: 0 0 8px 0; color: var(--color-teal-500);">
                    MTC ${bus.busNumber} - Chennai
                </h4>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Route:</strong> ${routeName}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Driver:</strong> ${bus.driver}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Current:</strong> ${currentLocation}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Next Stop:</strong> ${nextStop} (${bus.eta})
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>GPS:</strong> ${bus.coordinates.lat.toFixed(6)}, ${bus.coordinates.lng.toFixed(6)}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Accuracy:</strong> ±${bus.coordinates.accuracy}m
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Speed:</strong> ${bus.coordinates.speed.toFixed(1)} km/h
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Passengers:</strong> ${bus.passengers}/${bus.capacity} | <strong>Fare:</strong> ${bus.fare}
                </p>
                <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px;">
                    <span>${batteryIcon} ${bus.batteryLevel}%</span>
                    <span>${signalBars} ${bus.signalStrength}/5</span>
                    <span>🛰️ ${bus.satellites}</span>
                </div>
                <p style="margin: 4px 0 0 0; font-size: 10px; color: #666;">
                    Last update: ${localTime} IST
                </p>
            </div>
        `;
    }

    renderRoutes() {
        // Clear existing routes
        Object.values(this.routePolylines).forEach(polyline => {
            this.map.removeLayer(polyline);
        });
        this.routePolylines = {};

        this.chennaiRoutes.forEach(route => {
            const waypoints = route.waypoints.map(wp => [wp.lat, wp.lng]);
            
            const polyline = L.polyline(waypoints, {
                color: route.color,
                weight: 4,
                opacity: 0.8,
                dashArray: route.deviceId === 'MTC_GPS_004' ? '10, 5' : null, // Dashed for low battery bus
                className: 'mtc-route-line'
            }).addTo(this.map);

            this.routePolylines[route.deviceId] = polyline;

            // Add route waypoints as small circles
            route.waypoints.forEach(wp => {
                const stopName = this.currentLanguage === 'tamil' ? wp.nameTamil : wp.name;
                L.circleMarker([wp.lat, wp.lng], {
                    radius: 6,
                    fillColor: route.color,
                    fillOpacity: 0.9,
                    color: 'white',
                    weight: 2
                }).bindTooltip(stopName, { 
                    permanent: false, 
                    direction: 'top',
                    offset: [0, -10]
                }).addTo(this.map);
            });
        });
    }

    renderLandmarks() {
        // Clear existing landmarks
        Object.values(this.landmarkMarkers).forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.landmarkMarkers = {};

        this.chennaiLandmarks.forEach(landmark => {
            const landmarkName = this.currentLanguage === 'tamil' ? landmark.nameTamil : landmark.name;
            
            let icon = '🏛️'; // default
            if (landmark.type === 'tourist') icon = '🏖️';
            if (landmark.type === 'transport') icon = '🚉';
            if (landmark.type === 'religious') icon = '🛕';
            if (landmark.type === 'shopping') icon = '🛒';
            if (landmark.type === 'historical') icon = '🏰';

            const landmarkIcon = L.divIcon({
                className: 'landmark-marker',
                html: `<div style="
                    width: 20px; 
                    height: 20px; 
                    background-color: rgba(94, 82, 64, 0.8);
                    border: 2px solid white;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                ">${icon}</div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker([landmark.lat, landmark.lng], { icon: landmarkIcon })
                .bindTooltip(landmarkName, { 
                    permanent: false, 
                    direction: 'top',
                    offset: [0, -15]
                })
                .addTo(this.map);

            this.landmarkMarkers[landmark.name] = marker;
        });
    }

    bindEvents() {
        // Route view selector
        const routeSelect = document.getElementById('routeView');
        if (routeSelect) {
            routeSelect.addEventListener('change', (e) => {
                this.selectedRoute = e.target.value;
                this.updateMapView();
            });
        }

        // Language toggle
        const languageSelect = document.getElementById('languageToggle');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.updateLanguage();
            });
        }

        // Layer controls
        const showAccuracy = document.getElementById('showAccuracy');
        if (showAccuracy) {
            showAccuracy.addEventListener('change', (e) => {
                this.layerSettings.showAccuracy = e.target.checked;
                this.toggleAccuracyCircles();
            });
        }

        const showRoutes = document.getElementById('showRoutes');
        if (showRoutes) {
            showRoutes.addEventListener('change', (e) => {
                this.layerSettings.showRoutes = e.target.checked;
                this.toggleRoutes();
            });
        }

        const showLandmarks = document.getElementById('showLandmarks');
        if (showLandmarks) {
            showLandmarks.addEventListener('change', (e) => {
                this.layerSettings.showLandmarks = e.target.checked;
                this.toggleLandmarks();
            });
        }

        const showLabels = document.getElementById('showLabels');
        if (showLabels) {
            showLabels.addEventListener('change', (e) => {
                this.layerSettings.showLabels = e.target.checked;
                this.toggleLabels();
            });
        }

        // Tracking toggle
        const trackingToggle = document.getElementById('trackingToggle');
        if (trackingToggle) {
            trackingToggle.addEventListener('click', () => {
                this.toggleTracking();
            });
        }

        // Map controls
        const centerChennai = document.getElementById('centerChennai');
        if (centerChennai) {
            centerChennai.addEventListener('click', () => {
                this.centerOnChennai();
            });
        }

        const refreshGPS = document.getElementById('refreshGPS');
        if (refreshGPS) {
            refreshGPS.addEventListener('click', () => {
                this.refreshAllBusData();
            });
        }

        // Modal controls
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const busModal = document.getElementById('busModal');
        if (busModal) {
            busModal.addEventListener('click', (e) => {
                if (e.target.id === 'busModal') {
                    this.closeModal();
                }
            });
        }
    }

    updateMapView() {
        const mapTitle = document.getElementById('mapTitle');
        
        if (this.selectedRoute === 'all') {
            this.centerOnChennai();
            if (mapTitle) mapTitle.textContent = 'Chennai MTC Bus Routes - Live Tracking';
        } else {
            const bus = this.mtcBuses.find(b => b.deviceId === this.selectedRoute);
            if (bus) {
                this.map.setView([bus.coordinates.lat, bus.coordinates.lng], 14);
                const routeName = this.currentLanguage === 'tamil' ? bus.routeTamil : bus.route;
                if (mapTitle) mapTitle.textContent = `MTC ${bus.busNumber} - ${routeName}`;
            }
        }
    }

    updateLanguage() {
        // Update all popups and tooltips
        this.mtcBuses.forEach(bus => {
            const marker = this.busMarkers[bus.deviceId];
            if (marker) {
                marker.setPopupContent(this.createBusPopup(bus));
            }
        });

        // Update landmarks
        if (this.layerSettings.showLandmarks) {
            this.renderLandmarks();
        }

        // Re-render route waypoints
        if (this.layerSettings.showRoutes) {
            this.renderRoutes();
        }

        this.renderAlerts();
        this.renderBusList();
    }

    centerOnChennai() {
        // Show all buses within Chennai area
        const group = new L.featureGroup(Object.values(this.busMarkers));
        if (group.getLayers().length > 0) {
            this.map.fitBounds(group.getBounds().pad(0.1));
        } else {
            this.map.setView([this.chennaiCenter.lat, this.chennaiCenter.lng], 11);
        }
    }

    toggleAccuracyCircles() {
        Object.values(this.accuracyCircles).forEach(circle => {
            if (this.layerSettings.showAccuracy) {
                this.map.addLayer(circle);
            } else {
                this.map.removeLayer(circle);
            }
        });
    }

    toggleRoutes() {
        Object.values(this.routePolylines).forEach(polyline => {
            this.map.removeLayer(polyline);
        });
        
        if (this.layerSettings.showRoutes) {
            this.renderRoutes();
        }
    }

    toggleLandmarks() {
        Object.values(this.landmarkMarkers).forEach(marker => {
            this.map.removeLayer(marker);
        });

        if (this.layerSettings.showLandmarks) {
            this.renderLandmarks();
        }
    }

    toggleLabels() {
        Object.values(this.busMarkers).forEach(marker => {
            if (this.layerSettings.showLabels) {
                if (marker._popup) {
                    marker.bindPopup(marker._popup._content);
                }
            } else {
                marker.unbindPopup();
            }
        });
    }

    toggleTracking() {
        const button = document.getElementById('trackingToggle');
        
        if (this.isTracking) {
            this.isTracking = false;
            clearInterval(this.trackingInterval);
            if (button) {
                button.textContent = '▶️ Start Live Tracking';
                button.classList.remove('btn--primary');
                button.classList.add('btn--secondary');
            }
        } else {
            this.isTracking = true;
            this.startRealTimeUpdates();
            if (button) {
                button.textContent = '🔴 Live Tracking ON';
                button.classList.remove('btn--secondary');
                button.classList.add('btn--primary');
            }
        }
    }

    startRealTimeUpdates() {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
        }
        
        this.trackingInterval = setInterval(() => {
            this.simulateGPSUpdates();
        }, 3000); // Update every 3 seconds
    }

    simulateGPSUpdates() {
        if (!this.isTracking) return;

        this.mtcBuses.forEach(bus => {
            if (bus.deviceStatus === 'online') {
                // Simulate small GPS movements within Chennai
                const latDelta = (Math.random() - 0.5) * 0.0005; // ~55m max movement
                const lngDelta = (Math.random() - 0.5) * 0.0005;
                
                // Keep buses within Chennai 25km radius
                const newLat = bus.coordinates.lat + latDelta;
                const newLng = bus.coordinates.lng + lngDelta;
                
                const distance = this.calculateDistance(newLat, newLng, this.chennaiCenter.lat, this.chennaiCenter.lng);
                
                if (distance <= this.maxRadius) {
                    bus.coordinates.lat = newLat;
                    bus.coordinates.lng = newLng;
                }
                
                bus.coordinates.heading = (bus.coordinates.heading + (Math.random() - 0.5) * 15) % 360;
                bus.coordinates.speed = Math.max(5, Math.min(45, bus.coordinates.speed + (Math.random() - 0.5) * 5));
                bus.coordinates.accuracy = 2 + Math.random() * 2; // 2-4m accuracy
                bus.lastUpdate = new Date().toISOString();

                // Update marker position
                const marker = this.busMarkers[bus.deviceId];
                if (marker) {
                    marker.setLatLng([bus.coordinates.lat, bus.coordinates.lng]);
                    marker.setPopupContent(this.createBusPopup(bus));
                }

                // Update accuracy circle
                const accuracyCircle = this.accuracyCircles[bus.deviceId];
                if (accuracyCircle && this.layerSettings.showAccuracy) {
                    accuracyCircle.setLatLng([bus.coordinates.lat, bus.coordinates.lng]);
                    accuracyCircle.setRadius(bus.coordinates.accuracy);
                }
            }

            // Simulate battery drain
            if (bus.batteryLevel > 0) {
                bus.batteryLevel = Math.max(0, bus.batteryLevel - 0.05);
                
                // Create low battery alert
                if (bus.batteryLevel <= 25 && bus.deviceStatus !== 'low_battery') {
                    bus.deviceStatus = 'low_battery';
                    this.addAlert({
                        id: `alert_battery_${bus.deviceId}`,
                        deviceId: bus.deviceId,
                        type: 'low_battery',
                        message: `MTC Bus ${bus.busNumber} battery critically low at ${Math.round(bus.batteryLevel)}%`,
                        messageTamil: `எம்டிசி பஸ் ${bus.busNumber} பேட்டரி ${Math.round(bus.batteryLevel)}% - அவசர சார்ஜிங் தேவை`,
                        severity: 'warning',
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });

        this.updateSystemStats();
        this.renderBusList();
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    refreshAllBusData() {
        this.mtcBuses.forEach(bus => {
            bus.lastUpdate = new Date().toISOString();
            
            // Simulate GPS refresh with improved accuracy
            if (bus.deviceStatus === 'online') {
                bus.coordinates.accuracy = Math.max(1, bus.coordinates.accuracy - 0.3);
                bus.satellites = Math.min(12, bus.satellites + Math.floor(Math.random() * 2));
            }
        });

        this.renderAllBuses();
        this.updateSystemStats();
        
        // Visual feedback
        const button = document.getElementById('refreshGPS');
        if (button) {
            const originalText = button.textContent;
            button.textContent = '✅ Bus Data Refreshed';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1500);
        }
    }

    showBusDetails(bus) {
        const modal = document.getElementById('busModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        if (!modal || !title || !body) return;

        const routeName = this.currentLanguage === 'tamil' ? bus.routeTamil : bus.route;
        const currentLocation = this.currentLanguage === 'tamil' ? bus.currentLocationTamil : bus.currentLocation;
        const nextStop = this.currentLanguage === 'tamil' ? bus.nextStopTamil : bus.nextStop;

        title.textContent = `MTC ${bus.busNumber} - Chennai Bus Details`;

        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Bus Number</span>
                    <span class="detail-value">MTC ${bus.busNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Route</span>
                    <span class="detail-value">${routeName}</span>
                    ${this.currentLanguage === 'english' ? `<span class="detail-value-tamil">${bus.routeTamil}</span>` : ''}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Driver</span>
                    <span class="detail-value">${bus.driver}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value status status--${bus.deviceStatus === 'online' ? 'success' : 'warning'}">${bus.deviceStatus.toUpperCase()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Current Location</span>
                    <span class="detail-value">${currentLocation}</span>
                    ${this.currentLanguage === 'english' ? `<span class="detail-value-tamil">${bus.currentLocationTamil}</span>` : ''}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Next Stop</span>
                    <span class="detail-value">${nextStop} (${bus.eta})</span>
                    ${this.currentLanguage === 'english' ? `<span class="detail-value-tamil">${bus.nextStopTamil}</span>` : ''}
                </div>
                <div class="detail-item">
                    <span class="detail-label">GPS Coordinates</span>
                    <div class="gps-coordinates">
                        Lat: ${bus.coordinates.lat.toFixed(7)}<br>
                        Lng: ${bus.coordinates.lng.toFixed(7)}
                    </div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">GPS Accuracy</span>
                    <span class="detail-value">±${bus.coordinates.accuracy.toFixed(1)}m</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Speed & Heading</span>
                    <span class="detail-value">${bus.coordinates.speed.toFixed(1)} km/h @ ${bus.coordinates.heading.toFixed(0)}°</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Altitude</span>
                    <span class="detail-value">${bus.coordinates.altitude.toFixed(1)}m ASL</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Satellites</span>
                    <span class="detail-value">${bus.satellites} connected</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Signal Strength</span>
                    <span class="detail-value">${bus.signalStrength}/5 bars</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Battery Level</span>
                    <span class="detail-value" style="color: ${bus.batteryLevel < 25 ? 'var(--color-warning)' : 'var(--color-success)'}">${bus.batteryLevel}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Passengers</span>
                    <span class="detail-value">${bus.passengers}/${bus.capacity} (${Math.round((bus.passengers/bus.capacity)*100)}%)</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Distance to Next Stop</span>
                    <span class="detail-value">${bus.distanceToNext}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Fare</span>
                    <span class="detail-value">${bus.fare}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Last GPS Update</span>
                    <span class="detail-value">${new Date(bus.lastUpdate).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})} IST</span>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    closeModal() {
        const modal = document.getElementById('busModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    updateCoordinateDisplay(bus) {
        const display = document.getElementById('coordinateDisplay');
        if (display && bus) {
            display.textContent = `${bus.coordinates.lat.toFixed(6)}, ${bus.coordinates.lng.toFixed(6)} (±${bus.coordinates.accuracy.toFixed(1)}m)`;
        }
    }

    renderBusList() {
        const container = document.getElementById('busListContainer');
        if (!container) return;

        container.innerHTML = '';

        this.mtcBuses.forEach(bus => {
            const busItem = document.createElement('div');
            busItem.className = `device-item ${bus.deviceStatus}`;
            
            // Battery icon based on level
            const batteryIcon = bus.batteryLevel > 75 ? '🔋' :
                               bus.batteryLevel > 50 ? '🔋' :
                               bus.batteryLevel > 25 ? '🪫' : '🪫';

            const routeName = this.currentLanguage === 'tamil' ? bus.routeTamil : bus.route;
            const currentLocation = this.currentLanguage === 'tamil' ? bus.currentLocationTamil : bus.currentLocation;

            busItem.innerHTML = `
                <div class="device-item-left">
                    <div class="device-status-indicator ${bus.deviceStatus}"></div>
                    <div class="device-info">
                        <h4>MTC ${bus.busNumber}</h4>
                        <p><span class="device-location">${currentLocation}</span> • ${routeName}</p>
                    </div>
                </div>
                <div class="device-item-right">
                    <div class="battery-level">
                        <span class="battery-icon">${batteryIcon}</span>
                        <span>${Math.round(bus.batteryLevel)}%</span>
                    </div>
                    <div class="signal-strength">
                        <span>📶 ${bus.signalStrength}/5</span>
                        <div class="signal-bars">
                            ${Array.from({length: 5}, (_, i) => 
                                `<div class="signal-bar ${i < bus.signalStrength ? 'active' : ''}"></div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;

            busItem.addEventListener('click', () => {
                this.showBusDetails(bus);
                
                // Focus map on this bus
                const routeSelect = document.getElementById('routeView');
                if (routeSelect) {
                    routeSelect.value = bus.deviceId;
                }
                this.selectedRoute = bus.deviceId;
                this.updateMapView();
            });

            container.appendChild(busItem);
        });
    }

    renderAlerts() {
        const container = document.getElementById('alertsContainer');
        if (!container) return;

        container.innerHTML = '';

        // Sort alerts by timestamp (newest first)
        const sortedAlerts = [...this.alerts].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        sortedAlerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${alert.severity}`;
            
            const message = this.currentLanguage === 'tamil' ? alert.messageTamil : alert.message;
            const altMessage = this.currentLanguage === 'tamil' ? alert.message : alert.messageTamil;
            
            alertItem.innerHTML = `
                <div class="alert-time">${new Date(alert.timestamp).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})} IST</div>
                <div class="alert-message">${message}</div>
                ${this.currentLanguage === 'english' ? `<div class="alert-message-tamil">${altMessage}</div>` : ''}
            `;
            container.appendChild(alertItem);
        });
    }

    addAlert(alert) {
        this.alerts.unshift(alert); // Add to beginning
        
        // Limit to last 10 alerts
        if (this.alerts.length > 10) {
            this.alerts = this.alerts.slice(0, 10);
        }
        
        this.renderAlerts();
    }

    updateSystemStats() {
        const onlineDevices = this.mtcBuses.filter(b => b.deviceStatus === 'online').length;
        const lowBatteryDevices = this.mtcBuses.filter(b => b.batteryLevel <= 25).length;
        const avgAccuracy = this.mtcBuses
            .reduce((sum, b) => sum + b.coordinates.accuracy, 0) / this.mtcBuses.length;
        const totalPassengers = this.mtcBuses.reduce((sum, b) => sum + b.passengers, 0);
        const totalCapacity = this.mtcBuses.reduce((sum, b) => sum + b.capacity, 0);
        const totalSatellites = this.mtcBuses.reduce((sum, b) => sum + b.satellites, 0);

        // Update header stats
        const activeDevicesEl = document.getElementById('activeDevices');
        const fleetUtilizationEl = document.getElementById('fleetUtilization');
        const avgAccuracyEl = document.getElementById('avgAccuracy');

        if (activeDevicesEl) activeDevicesEl.textContent = onlineDevices;
        if (fleetUtilizationEl) fleetUtilizationEl.textContent = Math.round((totalPassengers/totalCapacity)*100) + '%';
        if (avgAccuracyEl) avgAccuracyEl.textContent = avgAccuracy.toFixed(1) + 'm';

        // Update analytics
        const totalSatellitesEl = document.getElementById('totalSatellites');
        const totalPassengersEl = document.getElementById('totalPassengers');
        const systemUptimeEl = document.getElementById('systemUptime');
        const coverageRadiusEl = document.getElementById('coverageRadius');

        if (totalSatellitesEl) totalSatellitesEl.textContent = totalSatellites;
        if (totalPassengersEl) totalPassengersEl.textContent = totalPassengers;
        if (systemUptimeEl) systemUptimeEl.textContent = lowBatteryDevices === 0 ? '99.9%' : '99.2%';
        if (coverageRadiusEl) coverageRadiusEl.textContent = '25km';

        // Update fleet stats
        this.fleetStats = {
            totalMTCDevices: this.mtcBuses.length,
            onlineDevices: onlineDevices,
            lowBatteryDevices: lowBatteryDevices,
            totalPassengers: totalPassengers,
            totalCapacity: totalCapacity,
            averageAccuracy: avgAccuracy,
            fleetUtilization: Math.round((totalPassengers/totalCapacity)*100) + '%'
        };
    }
}

// Initialize the Chennai MTC Bus Tracking System when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚌 Initializing Chennai MTC GPS Bus Tracking System...');
    window.chennaiTracker = new ChennaiMTCTracker();
    console.log('✅ Chennai MTC Tracker initialized with 5 buses within 25km radius');
});