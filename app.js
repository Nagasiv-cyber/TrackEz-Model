// Trackez GPS Tracking Platform - Chennai MTC Partnership
class TrackezGPSPlatform {
    constructor() {
        this.trackezDevices = [];
        this.chennaiRoutes = [];
        this.chennaiLandmarks = [];
        this.trackezAlerts = [];
        this.fleetAnalytics = {};
        this.map = null;
        this.deviceMarkers = {};
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

        // Chennai center coordinates (25km radius)
        this.chennaiCenter = { lat: 13.0827, lng: 80.2707 };
        this.maxRadius = 25; // Trackez coverage area

        this.initializeTrackezData();
        this.initializeMap();
        this.bindEvents();
        this.startTrackezMonitoring();
        this.renderDeviceList();
        this.renderTrackezAlerts();
        this.updateFleetAnalytics();
    }

    initializeTrackezData() {
        // Load Trackez device data from provided JSON
        this.trackezDevices = [
            {
                trackezId: "TKZ_CHN_001",
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
                trackezStatus: "active",
                batteryLevel: 87,
                signalStrength: 5,
                satellites: 8,
                currentLocation: "Pondy Bazaar, T.Nagar",
                currentLocationTamil: "பாண்டி பஜார், டி.நகர்",
                nextStop: "Panagal Park",
                nextStopTamil: "பனகல் பார்க்",
                distanceToNext: "0.8 km",
                eta: "3 min",
                passengers: 32,
                capacity: 50,
                fare: "₹8",
                lastUpdate: "2025-09-07T15:08:45+05:30",
                trackezInsights: {
                    onTimePerformance: "92%",
                    fuelEfficiency: "Good",
                    routeAdherence: "100%"
                }
            },
            {
                trackezId: "TKZ_CHN_002",
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
                trackezStatus: "active",
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
                lastUpdate: "2025-09-07T15:08:42+05:30",
                trackezInsights: {
                    onTimePerformance: "88%",
                    fuelEfficiency: "Excellent", 
                    routeAdherence: "95%"
                }
            },
            {
                trackezId: "TKZ_CHN_003",
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
                trackezStatus: "active",
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
                lastUpdate: "2025-09-07T15:08:40+05:30",
                trackezInsights: {
                    onTimePerformance: "95%",
                    fuelEfficiency: "Good",
                    routeAdherence: "100%"
                }
            },
            {
                trackezId: "TKZ_CHN_004",
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
                trackezStatus: "low_battery_alert",
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
                lastUpdate: "2025-09-07T15:08:38+05:30",
                trackezInsights: {
                    onTimePerformance: "82%",
                    fuelEfficiency: "Average",
                    routeAdherence: "90%"
                }
            },
            {
                trackezId: "TKZ_CHN_005",
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
                trackezStatus: "active",
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
                lastUpdate: "2025-09-07T15:08:35+05:30",
                trackezInsights: {
                    onTimePerformance: "90%",
                    fuelEfficiency: "Good",
                    routeAdherence: "98%"
                }
            }
        ];

        this.chennaiRoutes = [
            {
                routeId: "route_21g",
                busNumber: "21G",
                routeName: "T.Nagar - Marina Beach",
                routeNameTamil: "டி.நகர் - மெரினா கடற்கரை",
                color: "#3498DB",
                trackezId: "TKZ_CHN_001",
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
                color: "#27AE60",
                trackezId: "TKZ_CHN_002",
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
                color: "#F39C12",
                trackezId: "TKZ_CHN_003", 
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
                trackezId: "TKZ_CHN_004",
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
                color: "#E74C3C",
                trackezId: "TKZ_CHN_005",
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

        this.trackezAlerts = [
            {
                id: "TKZ_ALERT_001",
                trackezId: "TKZ_CHN_004",
                type: "low_battery",
                priority: "high",
                message: "Trackez Device TKZ_CHN_004 (Bus 5M) requires immediate charging",
                messageTamil: "டிராக்கெஸ் சாதனம் TKZ_CHN_004 (5M பஸ்) உடனடியாக சார்ஜ் தேவை",
                severity: "warning",
                timestamp: "2025-09-07T15:05:00+05:30",
                actionRequired: "Schedule maintenance stop"
            },
            {
                id: "TKZ_ALERT_002", 
                type: "system_info",
                priority: "info",
                message: "Trackez platform operating optimally - 5 Chennai MTC buses monitored",
                messageTamil: "டிராக்கெஸ் தளம் சிறப்பாக செயல்படுகிறது - 5 சென்னை எம்.டி.சி பஸ்கள் கண்காணிக்கப்படுகின்றன",
                severity: "info",
                timestamp: "2025-09-07T15:00:00+05:30"
            }
        ];

        this.fleetAnalytics = {
            totalDevices: 5,
            activeDevices: 4,
            alerts: 1,
            averageAccuracy: "3.28m",
            totalPassengers: 183,
            totalCapacity: 262,
            fleetUtilization: "70%"
        };
    }

    initializeMap() {
        // Initialize Trackez map centered on Chennai
        this.map = L.map('chennaiMap').setView([this.chennaiCenter.lat, this.chennaiCenter.lng], 11);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | Trackez GPS Platform',
            maxZoom: 18
        }).addTo(this.map);

        // Add all Trackez monitored buses to map
        this.renderAllDevices();
        
        // Add Chennai landmarks
        if (this.layerSettings.showLandmarks) {
            this.renderLandmarks();
        }
    }

    renderAllDevices() {
        // Clear existing markers first
        Object.values(this.deviceMarkers).forEach(marker => {
            this.map.removeLayer(marker);
        });
        Object.values(this.accuracyCircles).forEach(circle => {
            this.map.removeLayer(circle);
        });
        this.deviceMarkers = {};
        this.accuracyCircles = {};

        this.trackezDevices.forEach(device => {
            this.addDeviceToMap(device);
        });

        if (this.layerSettings.showRoutes) {
            this.renderRoutes();
        }
    }

    addDeviceToMap(device) {
        const { lat, lng } = device.coordinates;

        // Create Trackez device marker based on status
        let markerColor = '#3498DB'; // active - blue
        if (device.trackezStatus === 'low_battery_alert') markerColor = '#F39C12'; // warning - orange
        if (device.trackezStatus === 'offline') markerColor = '#E74C3C'; // error - red

        // Create custom Trackez device icon
        const deviceIcon = L.divIcon({
            className: `bus-marker ${device.trackezStatus}`,
            html: `<div style="
                width: 28px; 
                height: 28px; 
                border-radius: 50%; 
                background: linear-gradient(135deg, ${markerColor}, #27AE60);
                border: 3px solid white;
                box-shadow: 0 3px 15px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
            ">📍</div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });

        // Add marker to map
        const marker = L.marker([lat, lng], { icon: deviceIcon }).addTo(this.map);

        // Bind popup
        marker.bindPopup(this.createDevicePopup(device));

        // Store marker reference
        this.deviceMarkers[device.trackezId] = marker;

        // Add GPS accuracy circle if enabled
        if (this.layerSettings.showAccuracy) {
            const accuracyCircle = L.circle([lat, lng], {
                radius: device.coordinates.accuracy,
                fillColor: markerColor,
                fillOpacity: 0.15,
                color: markerColor,
                weight: 2,
                dashArray: '8, 4'
            }).addTo(this.map);

            this.accuracyCircles[device.trackezId] = accuracyCircle;
        }

        // Add click event to show device details
        marker.on('click', () => {
            this.showDeviceDetails(device);
            this.updateCoordinateDisplay(device);
        });
    }

    createDevicePopup(device) {
        const localTime = new Date(device.lastUpdate).toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'});
        const batteryIcon = device.batteryLevel < 25 ? '🪫' : device.batteryLevel < 50 ? '🔋' : '🔋';
        const signalBars = '📶'.repeat(device.signalStrength);
        
        const routeName = this.currentLanguage === 'tamil' ? device.routeTamil : device.route;
        const currentLocation = this.currentLanguage === 'tamil' ? device.currentLocationTamil : device.currentLocation;
        const nextStop = this.currentLanguage === 'tamil' ? device.nextStopTamil : device.nextStop;
        
        return `
            <div style="font-family: var(--font-family-base); min-width: 240px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="background: linear-gradient(135deg, #3498DB, #27AE60); color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">
                        TRACKEZ
                    </div>
                    <h4 style="margin: 0; color: #2C3E50; font-size: 14px;">
                        MTC ${device.busNumber}
                    </h4>
                </div>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Trackez ID:</strong> ${device.trackezId}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Route:</strong> ${routeName}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Driver:</strong> ${device.driver}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Current:</strong> ${currentLocation}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Next Stop:</strong> ${nextStop} (${device.eta})
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>GPS:</strong> ${device.coordinates.lat.toFixed(6)}, ${device.coordinates.lng.toFixed(6)}
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Accuracy:</strong> ±${device.coordinates.accuracy}m
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Speed:</strong> ${device.coordinates.speed.toFixed(1)} km/h
                </p>
                <p style="margin: 4px 0; font-size: 12px;">
                    <strong>Passengers:</strong> ${device.passengers}/${device.capacity} | <strong>Fare:</strong> ${device.fare}
                </p>
                <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px;">
                    <span>${batteryIcon} ${device.batteryLevel}%</span>
                    <span>${signalBars} ${device.signalStrength}/5</span>
                    <span>🛰️ ${device.satellites}</span>
                </div>
                <div style="background: linear-gradient(135deg, #3498DB, #27AE60); color: white; padding: 4px 8px; margin-top: 6px; border-radius: 6px; font-size: 10px; text-align: center;">
                    Trackez Performance: ${device.trackezInsights.onTimePerformance} On-Time
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
                dashArray: route.trackezId === 'TKZ_CHN_004' ? '12, 6' : null, // Dashed for low battery device
                className: 'mtc-route-line'
            }).addTo(this.map);

            this.routePolylines[route.trackezId] = polyline;

            // Add route waypoints as small circles
            route.waypoints.forEach(wp => {
                const stopName = this.currentLanguage === 'tamil' ? wp.nameTamil : wp.name;
                L.circleMarker([wp.lat, wp.lng], {
                    radius: 6,
                    fillColor: route.color,
                    fillOpacity: 0.9,
                    color: 'white',
                    weight: 2
                }).bindTooltip(`${stopName} - Trackez Monitored`, { 
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
                    width: 22px; 
                    height: 22px; 
                    background: linear-gradient(135deg, #2C3E50, #34495E);
                    border: 2px solid white;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                ">${icon}</div>`,
                iconSize: [26, 26],
                iconAnchor: [13, 13]
            });

            const marker = L.marker([landmark.lat, landmark.lng], { icon: landmarkIcon })
                .bindTooltip(`${landmarkName} (Chennai Landmark)`, { 
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
                this.refreshAllDeviceData();
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
            if (mapTitle) mapTitle.textContent = 'Trackez GPS Monitoring - Chennai MTC Fleet';
        } else {
            const device = this.trackezDevices.find(d => d.trackezId === this.selectedRoute);
            if (device) {
                this.map.setView([device.coordinates.lat, device.coordinates.lng], 14);
                const routeName = this.currentLanguage === 'tamil' ? device.routeTamil : device.route;
                if (mapTitle) mapTitle.textContent = `Trackez Monitoring: ${device.busNumber} - ${routeName}`;
            }
        }
    }

    updateLanguage() {
        // Update all popups and tooltips
        this.trackezDevices.forEach(device => {
            const marker = this.deviceMarkers[device.trackezId];
            if (marker) {
                marker.setPopupContent(this.createDevicePopup(device));
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

        this.renderTrackezAlerts();
        this.renderDeviceList();
    }

    centerOnChennai() {
        // Show all Trackez devices within Chennai area
        const group = new L.featureGroup(Object.values(this.deviceMarkers));
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
        Object.values(this.deviceMarkers).forEach(marker => {
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
                button.textContent = '▶️ Start Trackez Monitoring';
                button.classList.remove('btn--primary');
                button.classList.add('btn--secondary');
            }
        } else {
            this.isTracking = true;
            this.startTrackezMonitoring();
            if (button) {
                button.textContent = '🔴 Live Tracking ON';
                button.classList.remove('btn--secondary');
                button.classList.add('btn--primary');
            }
        }
    }

    startTrackezMonitoring() {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
        }
        
        this.trackingInterval = setInterval(() => {
            this.simulateGPSUpdates();
        }, 3000); // Trackez updates every 3 seconds
    }

    simulateGPSUpdates() {
        if (!this.isTracking) return;

        this.trackezDevices.forEach(device => {
            if (device.trackezStatus === 'active') {
                // Simulate small GPS movements within Chennai
                const latDelta = (Math.random() - 0.5) * 0.0005; // ~55m max movement
                const lngDelta = (Math.random() - 0.5) * 0.0005;
                
                // Keep devices within Chennai 25km radius
                const newLat = device.coordinates.lat + latDelta;
                const newLng = device.coordinates.lng + lngDelta;
                
                const distance = this.calculateDistance(newLat, newLng, this.chennaiCenter.lat, this.chennaiCenter.lng);
                
                if (distance <= this.maxRadius) {
                    device.coordinates.lat = newLat;
                    device.coordinates.lng = newLng;
                }
                
                device.coordinates.heading = (device.coordinates.heading + (Math.random() - 0.5) * 15) % 360;
                device.coordinates.speed = Math.max(5, Math.min(45, device.coordinates.speed + (Math.random() - 0.5) * 5));
                device.coordinates.accuracy = 2 + Math.random() * 2; // 2-4m accuracy
                device.lastUpdate = new Date().toISOString();

                // Update marker position
                const marker = this.deviceMarkers[device.trackezId];
                if (marker) {
                    marker.setLatLng([device.coordinates.lat, device.coordinates.lng]);
                    marker.setPopupContent(this.createDevicePopup(device));
                }

                // Update accuracy circle
                const accuracyCircle = this.accuracyCircles[device.trackezId];
                if (accuracyCircle && this.layerSettings.showAccuracy) {
                    accuracyCircle.setLatLng([device.coordinates.lat, device.coordinates.lng]);
                    accuracyCircle.setRadius(device.coordinates.accuracy);
                }
            }

            // Simulate battery drain
            if (device.batteryLevel > 0) {
                device.batteryLevel = Math.max(0, device.batteryLevel - 0.05);
                
                // Create Trackez low battery alert
                if (device.batteryLevel <= 25 && device.trackezStatus !== 'low_battery_alert') {
                    device.trackezStatus = 'low_battery_alert';
                    this.addTrackezAlert({
                        id: `TKZ_ALERT_BATTERY_${device.trackezId}`,
                        trackezId: device.trackezId,
                        type: 'low_battery',
                        message: `Trackez Device ${device.trackezId} (Bus ${device.busNumber}) battery critically low at ${Math.round(device.batteryLevel)}%`,
                        messageTamil: `டிராக்கெஸ் சாதனம் ${device.trackezId} (பஸ் ${device.busNumber}) பேட்டரி ${Math.round(device.batteryLevel)}% - அவசர சார்ஜிங் தேவை`,
                        severity: 'warning',
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });

        this.updateFleetAnalytics();
        this.renderDeviceList();
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

    refreshAllDeviceData() {
        this.trackezDevices.forEach(device => {
            device.lastUpdate = new Date().toISOString();
            
            // Simulate GPS refresh with improved accuracy
            if (device.trackezStatus === 'active') {
                device.coordinates.accuracy = Math.max(1, device.coordinates.accuracy - 0.3);
                device.satellites = Math.min(12, device.satellites + Math.floor(Math.random() * 2));
            }
        });

        this.renderAllDevices();
        this.updateFleetAnalytics();
        
        // Visual feedback
        const button = document.getElementById('refreshGPS');
        if (button) {
            const originalText = button.textContent;
            button.textContent = '✅ Trackez Data Refreshed';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1500);
        }
    }

    showDeviceDetails(device) {
        const modal = document.getElementById('busModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        if (!modal || !title || !body) return;

        const routeName = this.currentLanguage === 'tamil' ? device.routeTamil : device.route;
        const currentLocation = this.currentLanguage === 'tamil' ? device.currentLocationTamil : device.currentLocation;
        const nextStop = this.currentLanguage === 'tamil' ? device.nextStopTamil : device.nextStop;

        title.textContent = `Trackez Analytics - ${device.busNumber}`;

        body.innerHTML = `
            <div style="background: linear-gradient(135deg, #3498DB, #27AE60); color: white; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                <strong>Trackez Device ID:</strong> ${device.trackezId}<br>
                <small>Powered by Chennai MTC Partnership</small>
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Bus Number</span>
                    <span class="detail-value">MTC ${device.busNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Route</span>
                    <span class="detail-value">${routeName}</span>
                    ${this.currentLanguage === 'english' ? `<span class="detail-value-tamil">${device.routeTamil}</span>` : ''}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Driver</span>
                    <span class="detail-value">${device.driver}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Trackez Status</span>
                    <span class="detail-value status status--${device.trackezStatus === 'active' ? 'success' : 'warning'}">${device.trackezStatus.toUpperCase()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Current Location</span>
                    <span class="detail-value">${currentLocation}</span>
                    ${this.currentLanguage === 'english' ? `<span class="detail-value-tamil">${device.currentLocationTamil}</span>` : ''}
                </div>
                <div class="detail-item">
                    <span class="detail-label">Next Stop</span>
                    <span class="detail-value">${nextStop} (${device.eta})</span>
                    ${this.currentLanguage === 'english' ? `<span class="detail-value-tamil">${device.nextStopTamil}</span>` : ''}
                </div>
                <div class="detail-item">
                    <span class="detail-label">GPS Coordinates</span>
                    <div class="gps-coordinates">
                        Lat: ${device.coordinates.lat.toFixed(7)}<br>
                        Lng: ${device.coordinates.lng.toFixed(7)}
                    </div>
                </div>
                <div class="detail-item">
                    <span class="detail-label">GPS Accuracy</span>
                    <span class="detail-value">±${device.coordinates.accuracy.toFixed(1)}m</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Speed & Heading</span>
                    <span class="detail-value">${device.coordinates.speed.toFixed(1)} km/h @ ${device.coordinates.heading.toFixed(0)}°</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Altitude</span>
                    <span class="detail-value">${device.coordinates.altitude.toFixed(1)}m ASL</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Satellites</span>
                    <span class="detail-value">${device.satellites} connected</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Signal Strength</span>
                    <span class="detail-value">${device.signalStrength}/5 bars</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Battery Level</span>
                    <span class="detail-value" style="color: ${device.batteryLevel < 25 ? '#F39C12' : '#27AE60'}">${device.batteryLevel}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Passengers</span>
                    <span class="detail-value">${device.passengers}/${device.capacity} (${Math.round((device.passengers/device.capacity)*100)}%)</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Distance to Next Stop</span>
                    <span class="detail-value">${device.distanceToNext}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Fare</span>
                    <span class="detail-value">${device.fare}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Last Trackez Update</span>
                    <span class="detail-value">${new Date(device.lastUpdate).toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})} IST</span>
                </div>
            </div>
            <div style="background: linear-gradient(135deg, #F39C12, #E67E22); color: white; padding: 16px; border-radius: 8px; margin-top: 20px;">
                <h4 style="margin: 0 0 8px 0;">Trackez Performance Insights</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
                    <div>
                        <div style="font-size: 18px; font-weight: bold;">${device.trackezInsights.onTimePerformance}</div>
                        <div style="font-size: 12px; opacity: 0.9;">On-Time</div>
                    </div>
                    <div>
                        <div style="font-size: 18px; font-weight: bold;">${device.trackezInsights.fuelEfficiency}</div>
                        <div style="font-size: 12px; opacity: 0.9;">Fuel Efficiency</div>
                    </div>
                    <div>
                        <div style="font-size: 18px; font-weight: bold;">${device.trackezInsights.routeAdherence}</div>
                        <div style="font-size: 12px; opacity: 0.9;">Route Adherence</div>
                    </div>
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

    updateCoordinateDisplay(device) {
        const display = document.getElementById('coordinateDisplay');
        if (display && device) {
            display.textContent = `Trackez ${device.trackezId}: ${device.coordinates.lat.toFixed(6)}, ${device.coordinates.lng.toFixed(6)} (±${device.coordinates.accuracy.toFixed(1)}m)`;
        }
    }

    renderDeviceList() {
        const container = document.getElementById('busListContainer');
        if (!container) return;

        container.innerHTML = '';

        this.trackezDevices.forEach(device => {
            const deviceItem = document.createElement('div');
            deviceItem.className = `device-item ${device.trackezStatus}`;
            
            // Battery icon based on level
            const batteryIcon = device.batteryLevel > 75 ? '🔋' :
                               device.batteryLevel > 50 ? '🔋' :
                               device.batteryLevel > 25 ? '🪫' : '🪫';

            const routeName = this.currentLanguage === 'tamil' ? device.routeTamil : device.route;
            const currentLocation = this.currentLanguage === 'tamil' ? device.currentLocationTamil : device.currentLocation;

            deviceItem.innerHTML = `
                <div class="device-item-left">
                    <div class="device-status-indicator ${device.trackezStatus === 'active' ? 'online' : device.trackezStatus}"></div>
                    <div class="device-info">
                        <h4>MTC ${device.busNumber} <span style="font-size: 10px; color: #3498DB;">(${device.trackezId})</span></h4>
                        <p><span class="device-location">${currentLocation}</span> • ${routeName}</p>
                    </div>
                </div>
                <div class="device-item-right">
                    <div class="battery-level">
                        <span class="battery-icon">${batteryIcon}</span>
                        <span>${Math.round(device.batteryLevel)}%</span>
                    </div>
                    <div class="signal-strength">
                        <span>📶 ${device.signalStrength}/5</span>
                        <div class="signal-bars">
                            ${Array.from({length: 5}, (_, i) => 
                                `<div class="signal-bar ${i < device.signalStrength ? 'active' : ''}"></div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;

            deviceItem.addEventListener('click', () => {
                this.showDeviceDetails(device);
                
                // Focus map on this device
                const routeSelect = document.getElementById('routeView');
                if (routeSelect) {
                    routeSelect.value = device.trackezId;
                }
                this.selectedRoute = device.trackezId;
                this.updateMapView();
            });

            container.appendChild(deviceItem);
        });
    }

    renderTrackezAlerts() {
        const container = document.getElementById('alertsContainer');
        if (!container) return;

        container.innerHTML = '';

        // Sort alerts by timestamp (newest first)
        const sortedAlerts = [...this.trackezAlerts].sort((a, b) => 
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

    addTrackezAlert(alert) {
        this.trackezAlerts.unshift(alert); // Add to beginning
        
        // Limit to last 10 alerts
        if (this.trackezAlerts.length > 10) {
            this.trackezAlerts = this.trackezAlerts.slice(0, 10);
        }
        
        this.renderTrackezAlerts();
    }

    updateFleetAnalytics() {
        const activeDevices = this.trackezDevices.filter(d => d.trackezStatus === 'active').length;
        const lowBatteryDevices = this.trackezDevices.filter(d => d.batteryLevel <= 25).length;
        const avgAccuracy = this.trackezDevices
            .reduce((sum, d) => sum + d.coordinates.accuracy, 0) / this.trackezDevices.length;
        const totalPassengers = this.trackezDevices.reduce((sum, d) => sum + d.passengers, 0);
        const totalCapacity = this.trackezDevices.reduce((sum, d) => sum + d.capacity, 0);
        const totalSatellites = this.trackezDevices.reduce((sum, d) => sum + d.satellites, 0);

        // Update header stats
        const activeDevicesEl = document.getElementById('activeDevices');
        const fleetUtilizationEl = document.getElementById('fleetUtilization');
        const avgAccuracyEl = document.getElementById('avgAccuracy');

        if (activeDevicesEl) activeDevicesEl.textContent = activeDevices;
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

        // Update fleet analytics
        this.fleetAnalytics = {
            totalDevices: this.trackezDevices.length,
            activeDevices: activeDevices,
            lowBatteryDevices: lowBatteryDevices,
            totalPassengers: totalPassengers,
            totalCapacity: totalCapacity,
            averageAccuracy: avgAccuracy,
            fleetUtilization: Math.round((totalPassengers/totalCapacity)*100) + '%'
        };
    }
}

// Initialize the Trackez GPS Platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Trackez GPS Tracking Platform...');
    window.trackez = new TrackezGPSPlatform();
    console.log('✅ Trackez Platform initialized - 5 Chennai MTC buses monitored within 25km radius');
    console.log('📍 Trackez: Track Smart, Travel Easy - Powered by Chennai MTC');
});