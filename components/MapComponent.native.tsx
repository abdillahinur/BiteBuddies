import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

interface MapComponentProps {
  location: Location.LocationObject;
  radius: number;
  filteredRestaurants: any[];
}

export default function MapComponent({ location, radius, filteredRestaurants }: MapComponentProps) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
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
      
      {/* Restaurant Markers */}
      {filteredRestaurants.map((restaurant, index) => (
        <Marker
          key={restaurant.id}
          coordinate={{
            latitude: location.coords.latitude + (Math.random() - 0.5) * 0.01,
            longitude: location.coords.longitude + (Math.random() - 0.5) * 0.01,
          }}
          title={restaurant.name}
          description={`${restaurant.cuisine} • ${restaurant.rating}⭐ • ${restaurant.price}`}
        >
          <View style={{ 
            backgroundColor: '#FF6B6B', 
            borderRadius: 12, 
            paddingHorizontal: 8, 
            paddingVertical: 4,
            borderWidth: 2,
            borderColor: 'white'
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {restaurant.rating}
            </Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
} 