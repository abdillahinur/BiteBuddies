import React from 'react';
import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';

interface MapComponentProps {
  location: Location.LocationObject;
  radius: number;
  filteredRestaurants: any[];
}

export default function MapComponent({ location, radius, filteredRestaurants }: MapComponentProps) {
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
        }} />
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, textAlign: 'center' }}>
          📍 You are here{'\n'}({location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)})
        </Text>
        
        {/* Radius indicator */}
        <View style={{
          position: 'absolute',
          width: Math.min(200, Math.max(60, radius / 50)), // Scale from 60px to 200px max
          height: Math.min(200, Math.max(60, radius / 50)),
          borderRadius: Math.min(100, Math.max(30, radius / 100)),
          borderWidth: 2,
          borderColor: 'rgba(255, 107, 107, 0.5)',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          top: '50%',
          left: '50%',
          marginTop: -Math.min(100, Math.max(30, radius / 100)),
          marginLeft: -Math.min(100, Math.max(30, radius / 100)),
        }} />
        
        {/* Restaurant Markers */}
        {filteredRestaurants.map((restaurant, index) => {
          const angle = (index * 60) * (Math.PI / 180); // Convert to radians
          const distance = 80 + (index * 20);
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          
          return (
            <View 
              key={restaurant.id} 
              style={{ 
                position: 'absolute', 
                left: '50%',
                top: '50%',
                marginLeft: x - 25,
                marginTop: y - 15,
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <View style={{ 
                backgroundColor: '#FF6B6B', 
                borderRadius: 12, 
                paddingHorizontal: 8, 
                paddingVertical: 4,
                borderWidth: 2,
                borderColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 3,
              }}>
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{restaurant.rating}</Text>
              </View>
              <Text style={{ 
                fontSize: 8, 
                color: '#374151', 
                marginTop: 2, 
                maxWidth: 50, 
                textAlign: 'center',
                backgroundColor: 'rgba(255,255,255,0.8)',
                paddingHorizontal: 2,
                borderRadius: 2,
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
        }}>
          🔍 Search radius: {radius / 1000}km
        </Text>
      </View>
    </View>
  );
} 