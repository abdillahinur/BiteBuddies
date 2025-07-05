import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, MapPin, Clock, ChartBar as BarChart3, Users, Maximize2, Minimize2 } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import RestaurantCard from '@/components/RestaurantCard';
import BottomSheet from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [scoreView, setScoreView] = useState<'user' | 'group'>('user');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [radius, setRadius] = useState(1000);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [mapExpanded, setMapExpanded] = useState(false);

  const openFindNearby = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const closeFindNearby = () => {
    bottomSheetRef.current?.close();
  };

  const filters = ['All', 'Nearby', 'Trending', 'New', 'Top Rated'];

  const restaurants = [
    {
      id: '1',
      name: 'The Garden Cafe',
      cuisine: 'Mediterranean',
      rating: 4.7,
      reviews: 245,
      price: '$$',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '0.3 mi',
      time: '15-25 min',
      tags: ['Healthy', 'Vegetarian Friendly'],
      scores: {
        userScore: 8.5,
        groupScore: 7.8,
        overallRating: 4.7,
        freshness: 9.2,
        hygiene: 8.8,
        popularity: 7.5,
        value: 8.0,
        service: 8.3,
        ambiance: 8.7,
        lastUpdated: '2024-01-15T10:30:00Z',
      },
    },
    {
      id: '2',
      name: 'Spice Route',
      cuisine: 'Indian',
      rating: 4.6,
      reviews: 182,
      price: '$$$',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '0.8 mi',
      time: '20-30 min',
      tags: ['Authentic', 'Spicy'],
      scores: {
        userScore: 7.2,
        groupScore: 8.4,
        overallRating: 4.6,
        freshness: 8.5,
        hygiene: 8.0,
        popularity: 8.8,
        value: 7.5,
        service: 8.2,
        ambiance: 7.9,
        lastUpdated: '2024-01-15T09:15:00Z',
      },
    },
    {
      id: '3',
      name: 'Sakura Sushi',
      cuisine: 'Japanese',
      rating: 4.8,
      reviews: 324,
      price: '$$$$',
      image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '1.2 mi',
      time: '25-35 min',
      tags: ['Fresh', 'Premium'],
      scores: {
        userScore: 9.1,
        groupScore: 8.9,
        overallRating: 4.8,
        freshness: 9.5,
        hygiene: 9.3,
        popularity: 8.7,
        value: 7.8,
        service: 9.0,
        ambiance: 9.2,
        lastUpdated: '2024-01-15T11:45:00Z',
      },
    },
    {
      id: '4',
      name: 'Bella Vista',
      cuisine: 'Italian',
      rating: 4.9,
      reviews: 156,
      price: '$$$',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '0.5 mi',
      time: '18-28 min',
      tags: ['Romantic', 'Wine Bar'],
      scores: {
        userScore: 6.8,
        groupScore: 9.2,
        overallRating: 4.9,
        freshness: 8.9,
        hygiene: 9.1,
        popularity: 9.5,
        value: 8.5,
        service: 9.3,
        ambiance: 9.7,
        lastUpdated: '2024-01-15T08:20:00Z',
      },
    },
  ];

  const cuisines = [
    'Italian', 'Chinese', 'Japanese', 'Indian', 'Mexican', 'Thai',
    'Mediterranean', 'American', 'French', 'Korean', 'Vietnamese', 'Greek'
  ];
  const dietaryRestrictions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher',
    'Dairy-Free', 'Nut-Free', 'Low-Carb', 'Keto-Friendly'
  ];

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };
  const toggleDietary = (dietary: string) => {
    setSelectedDietary(prev =>
      prev.includes(dietary)
        ? prev.filter(d => d !== dietary)
        : [...prev, dietary]
    );
  };

  // Filter restaurants by cuisine/dietary (mock logic)
  const filteredRestaurants = restaurants.filter(r => {
    const cuisineMatch = selectedCuisines.length === 0 || selectedCuisines.includes(r.cuisine);
    const dietaryMatch = selectedDietary.length === 0 || (r.tags && selectedDietary.some(d => r.tags.includes(d)));
    return cuisineMatch && dietaryMatch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.scoreToggle, scoreView === 'user' && styles.scoreToggleActive]}
              onPress={() => setScoreView('user')}
            >
              <Text style={[styles.scoreToggleText, scoreView === 'user' && styles.scoreToggleTextActive]}>
                Your Scores
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.scoreToggle, scoreView === 'group' && styles.scoreToggleActive]}
              onPress={() => setScoreView('group')}
            >
              <Users size={16} color={scoreView === 'group' ? 'white' : '#6B7280'} />
              <Text style={[styles.scoreToggleText, scoreView === 'group' && styles.scoreToggleTextActive]}>
                Group
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants, cuisines..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Score View Indicator */}
        <View style={styles.scoreIndicator}>
          <BarChart3 size={16} color="#FF6B6B" />
          <Text style={styles.scoreIndicatorText}>
            Showing {scoreView === 'user' ? 'your personal' : 'group consensus'} scores
          </Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Map Button */}
        <TouchableOpacity style={styles.mapButton} onPress={openFindNearby}>
          <MapPin size={20} color="#FF6B6B" />
          <Text style={styles.mapButtonText}>Find Nearby</Text>
        </TouchableOpacity>

        {/* Restaurant List */}
        <View style={styles.restaurantList}>
          {restaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant}
              showGroupScore={scoreView === 'group'}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Sheet for Find Nearby */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["70%", "95%"]}
        enablePanDownToClose
        onClose={closeFindNearby}
      >
        <View style={{ flex: 1 }}>
          {/* Mock Map View */}
          <View style={{ flex: 1, minHeight: 250, backgroundColor: '#E8F4FD', borderRadius: 16, margin: 16, position: 'relative' }}>
            <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <MapPin size={24} color="#FF6B6B" />
              <Text style={{ fontSize: 18, color: '#374151', fontFamily: 'Inter-SemiBold', marginTop: 8 }}>Interactive Map View</Text>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#FF6B6B', marginTop: 20 }} />
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>You are here</Text>
              
              {/* Restaurant Markers */}
              {filteredRestaurants.map((restaurant, index) => (
                <View 
                  key={restaurant.id} 
                  style={{ 
                    position: 'absolute', 
                    left: 50 + (index * 60), 
                    top: 100 + (index * 40),
                    alignItems: 'center'
                  }}
                >
                  <View style={{ backgroundColor: '#FF6B6B', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Inter-Bold' }}>{restaurant.rating}</Text>
                  </View>
                  <Text style={{ fontSize: 10, color: '#374151', marginTop: 2, maxWidth: 60, textAlign: 'center' }}>{restaurant.name}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Radius Slider */}
          <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Search Radius: {radius}m</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={100}
              maximumValue={5000}
              value={radius}
              onValueChange={setRadius}
              minimumTrackTintColor="#FF6B6B"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#FF6B6B"
            />
            
            {/* Cuisine Filters */}
            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 16 }}>Cuisine Types</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
              {cuisines.map(cuisine => (
                <TouchableOpacity
                  key={cuisine}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: selectedCuisines.includes(cuisine) ? '#FF6B6B' : '#F3F4F6',
                    marginRight: 8,
                  }}
                  onPress={() => toggleCuisine(cuisine)}
                >
                  <Text style={{ color: selectedCuisines.includes(cuisine) ? 'white' : '#374151', fontWeight: 'bold' }}>{cuisine}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Dietary Filters */}
            <Text style={{ fontWeight: 'bold', fontSize: 14, marginTop: 8 }}>Dietary Restrictions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }}>
              {dietaryRestrictions.map(dietary => (
                <TouchableOpacity
                  key={dietary}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: selectedDietary.includes(dietary) ? '#FF6B6B' : '#F3F4F6',
                    marginRight: 8,
                  }}
                  onPress={() => toggleDietary(dietary)}
                >
                  <Text style={{ color: selectedDietary.includes(dietary) ? 'white' : '#374151', fontWeight: 'bold' }}>{dietary}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Expandable/Draggable Restaurant List */}
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 8 }}>Nearby Restaurants</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} showGroupScore={scoreView === 'group'} />
              ))}
            </ScrollView>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    gap: 4,
  },
  scoreToggleActive: {
    backgroundColor: '#FF6B6B',
  },
  scoreToggleText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  scoreToggleTextActive: {
    color: 'white',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  scoreIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  scoreIndicatorText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: '#FF6B6B',
  },
  filterChipText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  filterChipTextActive: {
    color: 'white',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mapButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontFamily: 'Inter-SemiBold',
  },
  restaurantList: {
    paddingHorizontal: 20,
  },
});