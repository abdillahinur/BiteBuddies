import React from 'react';
import { View, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';

interface MapComponentProps {
  location: Location.LocationObject;
  radius: number;
  filteredRestaurants: any[];
}

// This is a fallback component - platform-specific versions will override this
export default function MapComponent({ location, radius, filteredRestaurants }: MapComponentProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#E8F4FD', justifyContent: 'center', alignItems: 'center' }}>
      <MapPin size={24} color="#FF6B6B" />
      <Text style={{ fontSize: 16, color: '#374151', marginTop: 8 }}>
        Map loading...
      </Text>
    </View>
  );
} 