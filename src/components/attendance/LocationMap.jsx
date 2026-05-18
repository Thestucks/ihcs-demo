import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom user location icon (blue marker)
const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom zone center icon (red marker)
const zoneIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to auto-center map on user location
function MapUpdater({ userLocation }) {
    const map = useMap();

    useEffect(() => {
        if (userLocation) {
            map.setView([userLocation.latitude, userLocation.longitude], 16);
        }
    }, [userLocation, map]);

    return null;
}

function LocationMap({ userLocation, geofenceZones, isWithinZone }) {
    // Default center (Indonesia) if no user location
    const defaultCenter = [-6.2088, 106.8456]; // Jakarta
    const center = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : defaultCenter;

    return (
        <div className="location-map-container">
            <MapContainer
                center={center}
                zoom={userLocation ? 16 : 12}
                style={{ height: '400px', width: '100%', borderRadius: '12px' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Auto-center on user location */}
                {userLocation && <MapUpdater userLocation={userLocation} />}

                {/* User's current location marker */}
                {userLocation && (
                    <Marker
                        position={[userLocation.latitude, userLocation.longitude]}
                        icon={userIcon}
                    >
                        <Popup>
                            <div>
                                <strong>Lokasi Anda</strong><br />
                                {isWithinZone ? '✅ Dalam Zona' : '❌ Di Luar Zona'}
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Geofence zones */}
                {geofenceZones && geofenceZones.map((zone) => {
                    const currentZoneId = zone.zoneId || zone.zone_id || Math.random();
                    const currentZoneName = zone.zoneName || zone.zone_name;
                    const currentIsActive = zone.isActive !== undefined ? zone.isActive : zone.is_active;

                    return (
                        <React.Fragment key={currentZoneId}>
                            {/* Zone center marker */}
                            <Marker
                                position={[zone.latitude, zone.longitude]}
                                icon={zoneIcon}
                            >
                                <Popup>
                                    <div>
                                        <strong>{currentZoneName}</strong><br />
                                        Radius: {zone.radius} meter<br />
                                        Status: {currentIsActive ? '✅ Aktif' : '❌ Nonaktif'}
                                    </div>
                                </Popup>
                            </Marker>

                            {/* Zone circle overlay */}
                            <Circle
                                center={[zone.latitude, zone.longitude]}
                                radius={zone.radius}
                                pathOptions={{
                                    color: currentIsActive ? '#3b82f6' : '#9ca3af',
                                    fillColor: currentIsActive ? '#3b82f6' : '#9ca3af',
                                    fillOpacity: 0.2,
                                    weight: 2
                                }}
                            >
                                <Popup>
                                    <strong>{currentZoneName}</strong><br />
                                    Radius: {zone.radius} meter
                                </Popup>
                            </Circle>
                        </React.Fragment>
                    )
                })}
            </MapContainer>
        </div>
    );
}

export default LocationMap;
