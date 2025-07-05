import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';

interface MapComponentProps {
  location: Location.LocationObject;
  radius: number;
  filteredRestaurants: any[];
}

export default function MapComponent({ location, radius, filteredRestaurants }: MapComponentProps) {
  // Calculate circle size based on radius (scale it to fit the view)
  const circleSize = useMemo(() => {
    // Base size calculation: map radius in meters to pixels
    // 1km = 40px, 2km = 80px, 5km = 160px, 10km = 240px, 25km = 300px (max)
    const baseSize = Math.min(300, Math.max(40, (radius / 1000) * 40));
    return baseSize;
  }, [radius]);

  return (
    <View style={{ flex: 1, backgroundColor: '#E8F4FD', position: 'relative' }}>
      {/* Map Background Grid */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        opacity: 0.1
      }}>
        {[...Array(10)].map((_, i) => (
          <View key={`h${i}`} style={{ 
            position: 'absolute', 
            left: 0, 
            right: 0, 
            height: 1, 
            backgroundColor: '#374151',
            top: `${i * 10}%`
          }} />
        ))}
        {[...Array(10)].map((_, i) => (
          <View key={`v${i}`} style={{ 
            position: 'absolute', 
            top: 0, 
            bottom: 0, 
            width: 1, 
            backgroundColor: '#374151',
            left: `${i * 10}%`
          }} />
        ))}
      </View>

      <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <MapPin size={24} color="#FF6B6B" />
        <Text style={{ fontSize: 18, color: '#374151', fontWeight: '600', marginTop: 8 }}>
          Interactive Map View (Web)
        </Text>
        
        {/* Your Location */}
        <View style={{ 
          width: 20, 
          height: 20, 
          borderRadius: 10, 
          backgroundColor: '#FF6B6B', 
          marginTop: 20,
          borderWidth: 3,
          borderColor: 'white',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          zIndex: 20,
        }} />
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, textAlign: 'center' }}>
          📍 You are here{'\n'}({location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)})
        </Text>
        
        {/* Dynamic Radius Circle */}
        <View style={{
          position: 'absolute',
          width: circleSize * 2,
          height: circleSize * 2,
          borderRadius: circleSize,
          borderWidth: 2,
          borderColor: 'rgba(255, 107, 107, 0.5)',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          top: '50%',
          left: '50%',
          marginTop: -circleSize,
          marginLeft: -circleSize,
          zIndex: 1,
        }} />
        
        {/* Restaurant Markers - Show all displayed restaurants */}
        {filteredRestaurants.map((restaurant, index) => {
          // Position markers within the circle based on their actual distance
          const actualDistance = parseFloat(restaurant.distance) * 1000; // Convert km to meters
          const normalizedDistance = Math.min(actualDistance / radius, 0.9); // Cap at 90% of radius
          const angle = (index * 60) * (Math.PI / 180); // Convert to radians
          const markerDistance = normalizedDistance * circleSize;
          const x = Math.cos(angle) * markerDistance;
          const y = Math.sin(angle) * markerDistance;
          
          return (
            <View 
              key={restaurant.id} 
              style={{ 
                position: 'absolute', 
                left: '50%',
                top: '50%',
                marginLeft: x - 30,
                marginTop: y - 20,
                alignItems: 'center',
                zIndex: 10,
              }}
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
                shadowRadius: 3,
                elevation: 5,
                minWidth: 45,
                alignItems: 'center',
              }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>{restaurant.rating}</Text>
                <Text style={{ color: 'white', fontSize: 7, fontWeight: '600' }}>
                  {restaurant.scores?.overallRating || Math.round(restaurant.rating * 20)}
                </Text>
              </View>
              <Text style={{ 
                fontSize: 8, 
                color: '#374151', 
                marginTop: 2, 
                maxWidth: 60, 
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.9)',
                paddingHorizontal: 3,
                paddingVertical: 1,
                borderRadius: 3,
                fontWeight: '600',
              }}>
                {restaurant.name}
              </Text>
            </View>
          );
        })}
        
        {/* Distance indicator */}
        <Text style={{ 
          position: 'absolute', 
          bottom: 20, 
          fontSize: 12, 
          color: '#6B7280',
          backgroundColor: 'rgba(255,255,255,0.9)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          zIndex: 15,
        }}>
          🔍 Search radius: {radius / 1000}km
        </Text>
      </View>
    </View>
  );
} 