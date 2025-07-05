import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, Clock, MapPin, Share2, X, RefreshCw, UserPlus, Settings, Trash2, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import MapComponent from '@/components/MapComponent';
import RestaurantCard from '@/components/RestaurantCard';
import { fetchNearbyRestaurants, getPaginatedRestaurants, Restaurant } from '../../services/restaurantService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Session {
  id: string;
  name: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  status: 'voting' | 'decided';
  timeLeft?: string;
  topChoice?: string;
  votes?: number;
  totalVotes?: number;
  restaurant?: string;
  time?: string;
  location?: string;
  createdAt: string;
}

export default function SessionsScreen() {
  // Map discovery modal state
  const [showMapModal, setShowMapModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [radius, setRadius] = useState(25000);
  const radiusOptions = [5000, 10000, 25000, 50000, 100000];
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<Location.LocationPermissionResponse | null>(null);
  const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>([]);
  const [hasMoreRestaurants, setHasMoreRestaurants] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [suggestedRestaurants, setSuggestedRestaurants] = useState<{ [sessionId: string]: string[] }>({});
  
  // Create session modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [expectedDiners, setExpectedDiners] = useState('2');
  const [votingEndTime, setVotingEndTime] = useState('24');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [userSessions, setUserSessions] = useState<Session[]>([]);
  const [hiddenSessionIds, setHiddenSessionIds] = useState<string[]>([]);
  const [forceRender, setForceRender] = useState(0);

  // Initialize location and load sessions on component mount
  useEffect(() => {
    requestLocationPermission();
    loadUserSessions();
  }, []);

  // Debug hidden session IDs
  useEffect(() => {
    console.log('Hidden session IDs updated:', hiddenSessionIds);
  }, [hiddenSessionIds]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission({ status } as Location.LocationPermissionResponse);
      
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

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

  const activeSessions = [
    {
      id: '1',
      name: 'Weekend Brunch',
      members: [
        { id: '1', name: 'You', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: '2', name: 'Alex', avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: '3', name: 'Emma', avatar: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: '4', name: 'Mike', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100' },
      ],
      status: 'voting',
      timeLeft: '2h 30m',
      topChoice: 'Pancake Paradise',
      votes: 3,
      totalVotes: 4,
    },
    {
      id: '2',
      name: 'Team Lunch',
      members: [
        { id: '1', name: 'You', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: '2', name: 'Mike', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: '3', name: 'Sarah', avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: '4', name: 'Tom', avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100' },
      ],
      status: 'decided',
      restaurant: 'Sakura Sushi',
      time: 'Today at 1:00 PM',
      location: '0.5 mi away',
    },
  ];

  const openRestaurantSuggestion = (sessionId: string) => {
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

    setCurrentSessionId(sessionId);
    setShowMapModal(true);
    loadRestaurants();
  };

  const loadRestaurants = async () => {
    if (!location) return;
    
    try {
      setIsLoadingRestaurants(true);
      const restaurants = await fetchNearbyRestaurants(
        location,
        radius,
        selectedCuisines,
        selectedDietary
      );
      
      setAllRestaurants(restaurants);
      const { restaurants: firstPage, hasMore } = getPaginatedRestaurants(restaurants, 0, 5);
      setDisplayedRestaurants(firstPage);
      setHasMoreRestaurants(hasMore);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setIsLoadingRestaurants(false);
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

  const applyFilters = async () => {
    if (!location) return;
    
    try {
      setIsLoadingRestaurants(true);
      const restaurants = await fetchNearbyRestaurants(
        location,
        radius,
        selectedCuisines,
        selectedDietary
      );
      
      setAllRestaurants(restaurants);
      const { restaurants: firstPage, hasMore } = getPaginatedRestaurants(restaurants, 0, 5);
      setDisplayedRestaurants(firstPage);
      setHasMoreRestaurants(hasMore);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  const selectRestaurant = (restaurant: Restaurant) => {
    if (!currentSessionId) return;
    
    // Add restaurant to suggestions for this session
    setSuggestedRestaurants(prev => ({
      ...prev,
      [currentSessionId]: [...(prev[currentSessionId] || []), restaurant.name]
    }));
    
    setShowMapModal(false);
    setCurrentSessionId(null);
    
    Alert.alert(
      'Restaurant Suggested!',
      `${restaurant.name} has been added to your session suggestions.`,
      [{ text: 'OK' }]
    );
  };

  const closeMapModal = () => {
    setShowMapModal(false);
    setCurrentSessionId(null);
  };

  // Session management functions
  const loadUserSessions = async () => {
    try {
      const storedSessions = await AsyncStorage.getItem('userSessions');
      if (storedSessions) {
        setUserSessions(JSON.parse(storedSessions));
      }
      
      const hiddenIds = await AsyncStorage.getItem('hiddenSessionIds');
      if (hiddenIds) {
        setHiddenSessionIds(JSON.parse(hiddenIds));
      }
    } catch (error) {
      console.error('Error loading user sessions:', error);
    }
  };

  const saveUserSessions = async (sessions: Session[]) => {
    try {
      setUserSessions(sessions);
      await AsyncStorage.setItem('userSessions', JSON.stringify(sessions));
      console.log('User sessions updated to:', sessions.map(s => ({ id: s.id, name: s.name })));
    } catch (error) {
      console.error('Error saving user sessions:', error);
    }
  };

  const saveHiddenSessionIds = async (hiddenIds: string[]) => {
    try {
      await AsyncStorage.setItem('hiddenSessionIds', JSON.stringify(hiddenIds));
    } catch (error) {
      console.error('Error saving hidden session IDs:', error);
    }
  };

  const createNewSession = async () => {
    if (!newSessionName.trim()) {
      Alert.alert('Error', 'Please enter a session name');
      return;
    }

    if (!newRestaurantName.trim()) {
      Alert.alert('Error', 'Please enter a restaurant suggestion');
      return;
    }

    const dinersCount = parseInt(expectedDiners);
    if (isNaN(dinersCount) || dinersCount < 1 || dinersCount > 20) {
      Alert.alert('Error', 'Please enter a valid number of diners (1-20)');
      return;
    }

    setIsCreatingSession(true);
    
    try {
      const newSession: Session = {
        id: Date.now().toString(),
        name: newSessionName.trim(),
        members: [
          {
            id: '1',
            name: 'You',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
          }
        ],
        status: 'voting',
        timeLeft: '24h 0m',
        topChoice: newRestaurantName.trim(),
        votes: 1,
        totalVotes: dinersCount,
        createdAt: new Date().toISOString()
      };

      const updatedSessions = [newSession, ...userSessions];
      await saveUserSessions(updatedSessions);
      
      // Add the restaurant suggestion to the suggested restaurants
      setSuggestedRestaurants(prev => ({
        ...prev,
        [newSession.id]: [newRestaurantName.trim()]
      }));
      
      setNewSessionName('');
      setNewRestaurantName('');
      setExpectedDiners('2');
      setShowCreateModal(false);
      
      Alert.alert(
        'Session Created!',
        `"${newSession.name}" has been created with ${newRestaurantName.trim()} as the first suggestion. Share the session code with friends to join.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error creating session:', error);
      Alert.alert('Error', 'Failed to create session. Please try again.');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewSessionName('');
    setNewRestaurantName('');
    setExpectedDiners('2');
  };

  const deleteSession = async (sessionId: string, sessionName: string) => {
    console.log('Deleting session:', sessionId, sessionName);
    console.log('Current hiddenSessionIds:', hiddenSessionIds);
    console.log('Current userSessions:', userSessions.map(s => s.id));
    
    Alert.alert(
      'Delete Session',
      `Are you sure you want to delete "${sessionName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            console.log('Delete button pressed');
            try {
              // Check if it's a user-created session
              const isUserSession = userSessions.some(session => session.id === sessionId);
              console.log('Is user session:', isUserSession);
              
              if (isUserSession) {
                // Clear ALL session data and cache for user-created sessions
                console.log('Clearing all session data and cache');
                
                // Clear state immediately
                setUserSessions([]);
                setHiddenSessionIds([]);
                setSuggestedRestaurants({});
                
                // Clear AsyncStorage completely
                await AsyncStorage.multiRemove(['userSessions', 'hiddenSessionIds']);
                console.log('Successfully cleared all session cache');
                
                // Force re-render
                setForceRender(prev => prev + 1);
                
                Alert.alert('Session Deleted', `"${sessionName}" has been deleted and all session data cleared.`);
              } else {
                // It's a hardcoded session, add to hidden list
                const newHiddenIds = [...hiddenSessionIds, sessionId];
                console.log('Adding to hidden list:', newHiddenIds);
                setHiddenSessionIds(newHiddenIds);
                
                try {
                  await AsyncStorage.setItem('hiddenSessionIds', JSON.stringify(newHiddenIds));
                  console.log('Successfully saved hidden IDs to AsyncStorage');
                } catch (storageError) {
                  console.error('Error saving hidden IDs to AsyncStorage:', storageError);
                }
                
                // Remove suggested restaurants for this session
                setSuggestedRestaurants(prev => {
                  const updated = { ...prev };
                  delete updated[sessionId];
                  return updated;
                });
                
                // Force re-render
                setForceRender(prev => prev + 1);
                
                Alert.alert('Session Hidden', `You have left "${sessionName}".`);
              }
            } catch (error) {
              console.error('Error deleting session:', error);
              Alert.alert('Error', 'Failed to delete session. Please try again.');
            }
          }
        }
      ]
    );
  };

  const leaveSession = async (sessionId: string, sessionName: string) => {
    console.log('Leaving session:', sessionId, sessionName);
    console.log('Current hiddenSessionIds:', hiddenSessionIds);
    
    Alert.alert(
      'Leave Session',
      `Are you sure you want to leave "${sessionName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              // Add session to hidden list
              const newHiddenIds = [...hiddenSessionIds, sessionId];
              console.log('New hiddenSessionIds will be:', newHiddenIds);
              setHiddenSessionIds(newHiddenIds);
              await saveHiddenSessionIds(newHiddenIds);
              
              // Remove suggested restaurants for this session
              setSuggestedRestaurants(prev => {
                const updated = { ...prev };
                delete updated[sessionId];
                return updated;
              });
              
              // Force re-render
              setForceRender(prev => prev + 1);
              
              Alert.alert('Left Session', `You have left "${sessionName}".`);
            } catch (error) {
              console.error('Error leaving session:', error);
              Alert.alert('Error', 'Failed to leave session. Please try again.');
            }
          }
        }
      ]
    );
  };

  const isUserCreatedSession = (sessionId: string) => {
    return userSessions.some(session => session.id === sessionId);
  };

  const pastSessions = [
    {
      id: '1',
      name: 'Date Night',
      members: 2,
      restaurant: 'Bella Vista',
      date: '2 days ago',
      rating: 4.9,
    },
    {
      id: '2',
      name: 'Family Dinner',
      members: 5,
      restaurant: 'The Garden Cafe',
      date: '1 week ago',
      rating: 4.7,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sessions</Text>
          <TouchableOpacity style={styles.createButton} onPress={openCreateModal}>
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Active Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          {(() => {
            const filteredUserSessions = userSessions.filter(session => !hiddenSessionIds.includes(session.id));
            const filteredActiveSessions = activeSessions.filter(session => !hiddenSessionIds.includes(session.id));
            const allSessions = [...filteredUserSessions, ...filteredActiveSessions];
            
            console.log('Rendering sessions:');
            console.log('- All userSessions:', userSessions.map(s => ({ id: s.id, name: s.name })));
            console.log('- All activeSessions:', activeSessions.map(s => ({ id: s.id, name: s.name })));
            console.log('- hiddenSessionIds:', hiddenSessionIds);
            console.log('- filteredUserSessions:', filteredUserSessions.map(s => ({ id: s.id, name: s.name })));
            console.log('- filteredActiveSessions:', filteredActiveSessions.map(s => ({ id: s.id, name: s.name })));
            console.log('- allSessions to render:', allSessions.map(s => ({ id: s.id, name: s.name })));
            
            return allSessions;
          })().map((session) => (
            <View key={`${session.id}-${forceRender}`} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionName}>{session.name}</Text>
                </View>
                <View style={styles.sessionHeaderRight}>
                  <View style={styles.sessionStatus}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: session.status === 'voting' ? '#FFB800' : '#10B981' }
                    ]} />
                    <Text style={styles.statusText}>
                      {session.status === 'voting' ? 'Voting' : 'Decided'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.leaveButton}
                    onPress={() => {
                      if (isUserCreatedSession(session.id)) {
                        deleteSession(session.id, session.name);
                      } else {
                        leaveSession(session.id, session.name);
                      }
                    }}
                  >
                    {isUserCreatedSession(session.id) ? (
                      <Trash2 size={16} color="#DC2626" />
                    ) : (
                      <LogOut size={16} color="#DC2626" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.membersContainer}>
                <View style={styles.avatarStack}>
                  {session.members.slice(0, 3).map((member, index) => (
                    <Image
                      key={member.id}
                      source={{ uri: member.avatar }}
                      style={[styles.memberAvatar, { left: index * 20 }]}
                    />
                  ))}
                  {session.members.length > 3 && (
                    <View style={[styles.memberAvatar, styles.moreMembers, { left: 3 * 20 }]}>
                      <Text style={styles.moreMembersText}>+{session.members.length - 3}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.memberCount}>
                  {session.members.length} members
                </Text>
              </View>

              {session.status === 'voting' ? (
                <View style={styles.votingInfo}>
                  <View style={styles.votingRow}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.votingText}>Voting ends in {session.timeLeft}</Text>
                  </View>
                  <View style={styles.votingRow}>
                    <Text style={styles.topChoice}>Top choice: {session.topChoice}</Text>
                    <Text style={styles.votes}>{session.votes}/{session.totalVotes} votes</Text>
                  </View>
                  
                  {/* Suggested Restaurants */}
                  {suggestedRestaurants[session.id] && suggestedRestaurants[session.id].length > 0 && (
                    <View style={styles.suggestedRestaurants}>
                      <Text style={styles.suggestedTitle}>Suggested restaurants:</Text>
                      {suggestedRestaurants[session.id].map((restaurant, index) => (
                        <Text key={index} style={styles.suggestedRestaurant}>
                          • {restaurant}
                        </Text>
                      ))}
                    </View>
                  )}
                  
                  {/* Suggest Another Restaurant Button */}
                  <TouchableOpacity 
                    style={styles.suggestButton}
                    onPress={() => openRestaurantSuggestion(session.id)}
                  >
                    <Plus size={16} color="white" />
                    <Text style={styles.suggestButtonText}>Suggest Another Restaurant</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.decidedInfo}>
                  <View style={styles.decidedRow}>
                    <MapPin size={16} color="#10B981" />
                    <Text style={styles.decidedRestaurant}>{session.restaurant}</Text>
                  </View>
                  <View style={styles.decidedRow}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.decidedTime}>{session.time}</Text>
                  </View>
                  <Text style={styles.decidedLocation}>{session.location}</Text>
                </View>
              )}

              <View style={styles.sessionActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>
                    {session.status === 'voting' ? 'Vote Now' : 'View Details'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                  <Share2 size={16} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Past Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Sessions</Text>
          {pastSessions.map((session) => (
            <TouchableOpacity key={session.id} style={styles.pastSessionCard}>
              <View style={styles.pastSessionInfo}>
                <Text style={styles.pastSessionName}>{session.name}</Text>
                <View style={styles.pastSessionMeta}>
                  <Users size={14} color="#6B7280" />
                  <Text style={styles.pastSessionText}>{session.members} members</Text>
                  <Text style={styles.pastSessionDate}>{session.date}</Text>
                </View>
                <Text style={styles.pastSessionRestaurant}>{session.restaurant}</Text>
              </View>
              <View style={styles.pastSessionRating}>
                <Text style={styles.ratingText}>⭐ {session.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Create Session Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeCreateModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Create New Session</Text>
            <TouchableOpacity onPress={closeCreateModal} style={{ padding: 8 }}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{ flex: 1, padding: 20 }}>
            {/* Session Name Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                Session Name
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  backgroundColor: 'white',
                }}
                placeholder="Enter session name (e.g., Team Lunch, Date Night)"
                value={newSessionName}
                onChangeText={setNewSessionName}
                maxLength={50}
              />
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                {newSessionName.length}/50 characters
              </Text>
            </View>

            {/* Restaurant Suggestion Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                Restaurant Suggestion
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  backgroundColor: 'white',
                }}
                placeholder="Enter a restaurant you'd like to suggest"
                value={newRestaurantName}
                onChangeText={setNewRestaurantName}
                maxLength={100}
              />
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                This will be the first restaurant suggestion for voting
              </Text>
            </View>

            {/* Expected Diners Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                Expected Number of Diners
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  backgroundColor: 'white',
                  width: 100,
                }}
                placeholder="2"
                value={expectedDiners}
                onChangeText={setExpectedDiners}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                Total number of people who will dine (including you)
              </Text>
            </View>

            {/* Voting End Time Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                Voting Period (Hours)
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  backgroundColor: 'white',
                  width: 100,
                }}
                placeholder="24"
                value={votingEndTime}
                onChangeText={setVotingEndTime}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
                How many hours should voting remain open? (1-168 hours)
              </Text>
            </View>

            {/* Session Info */}
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 12 }}>
                Session Details
              </Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Users size={20} color="#6B7280" />
                <Text style={{ fontSize: 14, color: '#374151', marginLeft: 8 }}>
                  You'll be the session creator • {expectedDiners} expected diners
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Clock size={20} color="#6B7280" />
                <Text style={{ fontSize: 14, color: '#374151', marginLeft: 8 }}>
                  24 hours to vote on restaurants
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Share2 size={20} color="#6B7280" />
                <Text style={{ fontSize: 14, color: '#374151', marginLeft: 8 }}>
                  Share session code with friends to join
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MapPin size={20} color="#6B7280" />
                <Text style={{ fontSize: 14, color: '#374151', marginLeft: 8 }}>
                  Suggest restaurants from nearby options
                </Text>
              </View>
            </View>

            {/* Next Steps */}
            <View style={{ backgroundColor: '#FEF3F2', borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
                What happens next?
              </Text>
              <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20 }}>
                1. Your session will be created{'\n'}
                2. Invite friends using the session code{'\n'}
                3. Everyone can suggest and vote on restaurants{'\n'}
                4. Decide together where to dine!
              </Text>
            </View>
          </ScrollView>

          {/* Create Button */}
          <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
            <TouchableOpacity
              style={{
                backgroundColor: (newSessionName.trim() && newRestaurantName.trim() && expectedDiners.trim()) ? '#FF6B6B' : '#D1D5DB',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
              onPress={createNewSession}
              disabled={!newSessionName.trim() || !newRestaurantName.trim() || !expectedDiners.trim() || isCreatingSession}
            >
              {isCreatingSession ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Plus size={20} color="white" />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    Create Session
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Map Modal for Restaurant Suggestions */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeMapModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Suggest Restaurant</Text>
            <TouchableOpacity onPress={closeMapModal} style={{ padding: 8 }}>
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
                Tap a restaurant to suggest it ({displayedRestaurants.length} found)
              </Text>
              {displayedRestaurants.map((restaurant) => (
                <TouchableOpacity key={restaurant.id} onPress={() => selectRestaurant(restaurant)}>
                  <RestaurantCard restaurant={restaurant} showGroupScore={false} />
                </TouchableOpacity>
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
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createSessionCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  createSessionGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createSessionTitle: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Inter-Bold',
    marginTop: 8,
  },
  createSessionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  sessionName: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  sessionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatarStack: {
    flexDirection: 'row',
    height: 32,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
  },
  moreMembers: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreMembersText: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'Inter-SemiBold',
  },
  memberCount: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  votingInfo: {
    backgroundColor: '#FEF3F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  votingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  votingText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  topChoice: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  votes: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  decidedInfo: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  decidedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  decidedRestaurant: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  decidedTime: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  decidedLocation: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEF3F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pastSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pastSessionInfo: {
    flex: 1,
  },
  pastSessionName: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  pastSessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  pastSessionText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  pastSessionDate: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  pastSessionRestaurant: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Medium',
  },
  pastSessionRating: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  suggestedRestaurants: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  suggestedTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  suggestedRestaurant: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  suggestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestButtonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  // Map Modal Styles
  applyFiltersButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  applyFiltersText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadMoreButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 16,
  },
  loadMoreText: {
    color: '#374151',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});