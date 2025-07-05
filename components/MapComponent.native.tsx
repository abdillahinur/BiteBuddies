import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

interface MapComponentProps {
  location: Location.LocationObject;
  radius: number;
  filteredRestaurants: any[];
}

export default function MapComponent({ location, radius, filteredRestaurants }: MapComponentProps) {
  // Calculate map region based on radius to ensure circle is always visible
  const mapRegion = useMemo(() => {
    // Convert radius from meters to degrees (approximate)
    // 1 degree latitude ≈ 111,320 meters
    // 1 degree longitude ≈ 111,320 * cos(latitude) meters
    const latitudeDelta = (radius * 2.5) / 111320; // 2.5x radius for padding
    const longitudeDelta = (radius * 2.5) / (111320 * Math.cos(location.coords.latitude * Math.PI / 180));
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: Math.max(latitudeDelta, 0.005), // Minimum zoom level
      longitudeDelta: Math.max(longitudeDelta, 0.005),
    };
  }, [location.coords.latitude, location.coords.longitude, radius]);

  return (
    <MapView
      style={{ flex: 1 }}
      region={mapRegion}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {/* Radius Circle */}
      <Circle
        center={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        radius={radius}
        fillColor="rgba(255, 107, 107, 0.1)"
        strokeColor="rgba(255, 107, 107, 0.3)"
        strokeWidth={2}
      />
      
      {/* Restaurant Markers - Show all displayed restaurants */}
      {filteredRestaurants.map((restaurant, index) => (
        <Marker
          key={restaurant.id}
          coordinate={{
            latitude: restaurant.coordinates?.latitude || location.coords.latitude + (Math.random() - 0.5) * 0.01,
            longitude: restaurant.coordinates?.longitude || location.coords.longitude + (Math.random() - 0.5) * 0.01,
          }}
          title={restaurant.name}
          description={`${restaurant.cuisine} • ${restaurant.rating}⭐ • ${restaurant.price} • ${restaurant.distance}`}
        >
          <View style={{ 
            backgroundColor: '#FF6B6B', 
            borderRadius: 16, 
            paddingHorizontal: 10, 
            paddingVertical: 6,
            borderWidth: 2,
            borderColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            minWidth: 40,
            alignItems: 'center',
          }}>
            <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>
              {restaurant.rating}
            </Text>
            <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>
              {restaurant.scores?.overallRating || Math.round(restaurant.rating * 20)}
            </Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
} 