import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, MapPin, Clock, ChartBar as BarChart3, Users, Maximize2, Minimize2, X, RefreshCw, TrendingUp, Navigation, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import RestaurantCard from '@/components/RestaurantCard';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import MapComponent from '@/components/MapComponent';
import { fetchNearbyRestaurants, getPaginatedRestaurants, Restaurant } from '../../services/restaurantService';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Trending');
  const [scoreView, setScoreView] = useState<'user' | 'group'>('user');
  const [showMapModal, setShowMapModal] = useState(false);
  const [radius, setRadius] = useState(25000); // Default 25km to cover the whole city
  const radiusOptions = [5000, 10000, 25000, 50000, 100000]; // 5km, 10km, 25km, 50km, 100km
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.LocationPermissionResponse | null>(null);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreRestaurants, setHasMoreRestaurants] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [noRestaurantsFound, setNoRestaurantsFound] = useState(false);

  // Initialize location and load restaurants on component mount
  useEffect(() => {
    initializeDiscoverPage();
  }, []);

  const initializeDiscoverPage = async () => {
    try {
      setIsInitialLoading(true);
      await requestLocationPermission();
    } catch (error) {
      console.error('Error initializing discover page:', error);
      setIsInitialLoading(false);
    }
  };

  // Load restaurants when location changes
  useEffect(() => {
    if (location) {
      loadInitialRestaurants();
    }
  }, [location]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission({ status } as Location.LocationPermissionResponse);
      
      if (status === 'granted') {
        console.log('Location permission granted, getting current location...');
        const currentLocation = await Location.getCurrentPositionAsync({});
        console.log('Current location:', currentLocation.coords);
        setLocation(currentLocation);
      } else {
        setIsInitialLoading(false);
        Alert.alert(
          'Location Permission Required',
          'BiteBuddies needs location access to show nearby restaurants. Please enable location services in settings.',
          [
            { text: 'OK', onPress: () => {} }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setIsInitialLoading(false);
      Alert.alert('Location Error', 'Unable to get your location. Please enable location services.');
    }
  };

  const loadInitialRestaurants = async () => {
    if (!location) return;
    
    try {
      setIsLoadingRestaurants(true);
      console.log('Loading initial restaurants...');
      
      const restaurants = await fetchNearbyRestaurants(
        location,
        radius,
        selectedCuisines,
        selectedDietary
      );
      
      console.log(`Loaded ${restaurants.length} restaurants`);
      setAllRestaurants(restaurants);
      
      // Get first page of restaurants
      const { restaurants: firstPage, hasMore } = getPaginatedRestaurants(restaurants, 0, 5);
      setDisplayedRestaurants(firstPage);
      setHasMoreRestaurants(hasMore);
      setCurrentPage(0);
      setNoRestaurantsFound(restaurants.length === 0);
    } catch (error) {
      console.error('Error loading initial restaurants:', error);
      setNoRestaurantsFound(true);
    } finally {
      setIsLoadingRestaurants(false);
      setIsInitialLoading(false);
    }
  };

  const loadMoreRestaurants = async () => {
    if (!hasMoreRestaurants || isLoadingRestaurants) return;
    
    try {
      setIsLoadingRestaurants(true);
      const nextPage = currentPage + 1;
      const { restaurants: nextPageRestaurants, hasMore } = getPaginatedRestaurants(allRestaurants, nextPage, 5);
      
      setDisplayedRestaurants(prev => [...prev, ...nextPageRestaurants]);
      setHasMoreRestaurants(hasMore);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more restaurants:', error);
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const refreshRestaurants = async () => {
    if (!location) return;
    await loadInitialRestaurants();
  };

  const openFindNearby = async () => {
    console.log('Find Nearby button pressed!');
    
    if (locationPermission?.status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'BiteBuddies needs location access to show nearby restaurants.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable Location', onPress: requestLocationPermission }
        ]
      );
      return;
    }

    if (!location) {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        Alert.alert('Location Error', 'Unable to get your current location.');
        return;
      }
    }

    setShowMapModal(true);
  };

  const closeFindNearby = () => {
    setShowMapModal(false);
  };

  const applyFilters = async () => {
    if (!location) return;
    
    try {
      setIsLoadingRestaurants(true);
      console.log('Applying filters:', { selectedCuisines, selectedDietary, radius });
      
      const restaurants = await fetchNearbyRestaurants(
        location,
        radius,
        selectedCuisines,
        selectedDietary
      );
      
      setAllRestaurants(restaurants);
      
      // Get first page of filtered restaurants
      const { restaurants: firstPage, hasMore } = getPaginatedRestaurants(restaurants, 0, 5);
      setDisplayedRestaurants(firstPage);
      setHasMoreRestaurants(hasMore);
      setCurrentPage(0);
      setNoRestaurantsFound(restaurants.length === 0);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const filters = ['Trending', 'New', 'Top Rated'];

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

  // Apply filter type and search query to displayed restaurants
  const filteredDisplayedRestaurants = displayedRestaurants.filter(restaurant => {
    // First apply the filter type
    let passesFilter = true;
    
    switch (selectedFilter) {
      case 'Trending':
        // Show restaurants with high review counts and good overall scores
        passesFilter = restaurant.reviews >= 100 && restaurant.scores.overallRating >= 75;
        break;
      case 'New':
        // TODO: Implement proper "New" filter by cross-referencing with:
        // 1. User's visit history (restaurants not yet visited)
        // 2. Recently opened restaurants in the city
        // This would require:
        // - A user visits/history table in the database
        // - Restaurant opening dates or "new to city" flags
        // - Cross-reference current restaurants with user's visited restaurants
        // For now, show restaurants with lower popularity (indicating they're less visited/newer)
        passesFilter = restaurant.scores.popularity <= 40;
        break;
      case 'Top Rated':
        // Show restaurants with rating 4.5 or higher
        passesFilter = restaurant.rating >= 4.5;
        break;
      default:
        passesFilter = true;
    }
    
    if (!passesFilter) return false;
    
    // Then apply search query filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return restaurant.name.toLowerCase().includes(query) ||
           restaurant.cuisine.toLowerCase().includes(query) ||
           restaurant.tags.some(tag => tag.toLowerCase().includes(query));
  }).sort((a, b) => {
    // Sort based on the selected filter
    switch (selectedFilter) {
      case 'Trending':
        // Sort by combination of review count and overall score
        const aTrendingScore = (a.reviews * 0.3) + (a.scores.overallRating * 0.7);
        const bTrendingScore = (b.reviews * 0.3) + (b.scores.overallRating * 0.7);
        return bTrendingScore - aTrendingScore;
      case 'New':
        // Sort by lowest popularity first (indicating newer/less visited)
        return a.scores.popularity - b.scores.popularity;
      case 'Top Rated':
        // Sort by highest rating first, then by overall score
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return b.scores.overallRating - a.scores.overallRating;
      default:
        // Default to trending sorting
        const aDefaultScore = (a.reviews * 0.3) + (a.scores.overallRating * 0.7);
        const bDefaultScore = (b.reviews * 0.3) + (b.scores.overallRating * 0.7);
        return bDefaultScore - aDefaultScore;
    }
  });

  if (isInitialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Getting your location...</Text>
          <Text style={styles.loadingSubtext}>Finding nearby restaurants</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (locationPermission?.status !== 'granted') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MapPin size={48} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Location Permission Required</Text>
          <Text style={styles.errorText}>
            BiteBuddies needs location access to show nearby restaurants and help you discover great dining spots.
          </Text>
          <TouchableOpacity style={styles.enableLocationButton} onPress={requestLocationPermission}>
            <Text style={styles.enableLocationText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
            <TouchableOpacity style={styles.filterButton} onPress={refreshRestaurants}>
              <RefreshCw size={20} color="#374151" />
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

        {/* Filter Results Indicator */}
        <View style={styles.filterResultsIndicator}>
          <Text style={styles.filterResultsText}>
            {filteredDisplayedRestaurants.length} {selectedFilter.toLowerCase()} restaurants found
          </Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {filters.map((filter) => {
                         const getFilterIcon = () => {
               switch (filter) {
                 case 'Trending':
                   return <TrendingUp size={14} color={selectedFilter === filter ? 'white' : '#6B7280'} />;
                 case 'New':
                   return <Sparkles size={14} color={selectedFilter === filter ? 'white' : '#6B7280'} />;
                 case 'Top Rated':
                   return <Star size={14} color={selectedFilter === filter ? 'white' : '#6B7280'} />;
                 default:
                   return null;
               }
             };

            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <View style={styles.filterChipContent}>
                  {getFilterIcon()}
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedFilter === filter && styles.filterChipTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Map Button */}
        <TouchableOpacity style={styles.mapButton} onPress={openFindNearby}>
          <MapPin size={20} color="#FF6B6B" />
          <Text style={styles.mapButtonText}>Find Nearby</Text>
        </TouchableOpacity>

        {/* Restaurant List */}
        <View style={styles.restaurantList}>
          {isLoadingRestaurants && displayedRestaurants.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B6B" />
              <Text style={styles.loadingText}>Finding nearby restaurants...</Text>
            </View>
          ) : noRestaurantsFound ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsTitle}>No restaurants found</Text>
              <Text style={styles.noResultsText}>
                Try adjusting your search radius or filters to find more options.
              </Text>
              <TouchableOpacity style={styles.refreshButton} onPress={refreshRestaurants}>
                <RefreshCw size={16} color="#FF6B6B" />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {filteredDisplayedRestaurants.map((restaurant) => (
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant}
                  showGroupScore={scoreView === 'group'}
                />
              ))}
              
              {/* Load More Button */}
              {hasMoreRestaurants && (
                <TouchableOpacity 
                  style={styles.loadMoreButton} 
                  onPress={loadMoreRestaurants}
                  disabled={isLoadingRestaurants}
                >
                  {isLoadingRestaurants ? (
                    <ActivityIndicator size="small" color="#FF6B6B" />
                  ) : (
                    <Text style={styles.loadMoreText}>View More Restaurants</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Map Modal */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeFindNearby}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Find Nearby</Text>
            <TouchableOpacity onPress={closeFindNearby} style={{ padding: 8 }}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{ flex: 1 }}>
            {/* Map View */}
            <View style={{ height: 300, borderRadius: 16, margin: 16, overflow: 'hidden' }}>
              {location ? (
                <MapComponent 
                  location={location} 
                  radius={radius} 
                  filteredRestaurants={displayedRestaurants} 
                />
              ) : (
                <View style={{ flex: 1, backgroundColor: '#E8F4FD', justifyContent: 'center', alignItems: 'center' }}>
                  <MapPin size={24} color="#FF6B6B" />
                  <Text style={{ fontSize: 16, color: '#374151', marginTop: 8 }}>
                    {locationPermission?.status === 'granted' ? 'Getting your location...' : 'Location permission required'}
                  </Text>
                </View>
              )}
            </View>
            
            {/* Radius Slider */}
            <View style={{ padding: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>
                Search Radius: {radius / 1000}km
              </Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={radiusOptions.length - 1}
                step={1}
                value={radiusOptions.indexOf(radius)}
                onValueChange={(value) => setRadius(radiusOptions[Math.round(value)])}
                minimumTrackTintColor="#FF6B6B"
                maximumTrackTintColor="#E5E7EB"
                thumbTintColor="#FF6B6B"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                {radiusOptions.map((option) => (
                  <Text key={option} style={{ fontSize: 12, color: '#6B7280' }}>
                    {option / 1000}km
                  </Text>
                ))}
              </View>
              
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
              
              {/* Apply Filters Button */}
              <TouchableOpacity 
                style={styles.applyFiltersButton} 
                onPress={applyFilters}
                disabled={isLoadingRestaurants}
              >
                {isLoadingRestaurants ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.applyFiltersText}>Apply Filters</Text>
                )}
              </TouchableOpacity>
              
              {/* Restaurant List in Modal */}
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 16 }}>
                Nearby Restaurants ({displayedRestaurants.length})
              </Text>
              {displayedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} showGroupScore={scoreView === 'group'} />
              ))}
              
              {hasMoreRestaurants && (
                <TouchableOpacity 
                  style={styles.loadMoreButton} 
                  onPress={loadMoreRestaurants}
                  disabled={isLoadingRestaurants}
                >
                  {isLoadingRestaurants ? (
                    <ActivityIndicator size="small" color="#FF6B6B" />
                  ) : (
                    <Text style={styles.loadMoreText}>View More Restaurants</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#111827',
    marginTop: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    color: '#111827',
    marginTop: 16,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  enableLocationButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  enableLocationText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
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
  filterResultsIndicator: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterResultsText: {
    fontSize: 13,
    color: '#FF6B6B',
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
  filterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsTitle: {
    fontSize: 20,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  refreshButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadMoreButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loadMoreText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  applyFiltersButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  applyFiltersText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});