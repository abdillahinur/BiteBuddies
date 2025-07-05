// ...existing code...
// Add input/button styles to the StyleSheet

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Clock, Star, MapPin, Users, TrendingUp, ChartBar as BarChart3 } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);


  // Handler for searching user by name
  useEffect(() => {
    const fetchUser = async () => {
      setSearching(true);
      const hardcodedName = 'KJ';
      // Debug: log all users
      const { data: allUsers, error: allError } = await supabase
        .from('users')
        .select('*');
      console.log('All users:', allUsers, allError);

      // Try ilike with wildcard for debugging (case-insensitive, partial match)
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .ilike('name', '%KJ%')
        .limit(1);
      console.log('User search result:', { userData, error });
      setSearching(false);
      if (error || !userData || userData.length === 0) {
        setUser(null);
        return;
      }
      const userObj = userData[0];
      setUser({
        ...userObj,
        user_metadata: {
          name: userObj.name,
          profile_picture: userObj.profile_picture || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
          email: userObj.email,
        },
      });
    };
    fetchUser();
  }, []);

  const recentSessions = [
    {
      id: '1',
      name: 'Team Lunch',
      members: 4,
      restaurant: 'Sakura Sushi',
      time: '2 hours ago',
      rating: 4.8,
      groupScore: 8.9,
      userScore: 9.1,
    },
    {
      id: '2',
      name: 'Date Night',
      members: 2,
      restaurant: 'Bella Vista',
      time: '1 day ago',
      rating: 4.9,
      groupScore: 9.2,
      userScore: 6.8,
    },
  ];

  const recommendations = [
    {
      id: '1',
      name: 'The Garden Cafe',
      cuisine: 'Mediterranean',
      rating: 4.7,
      price: '$$',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '0.3 mi',
      scores: {
        friendsScore: 8.5, // Average score from friends who've been here
        groupScore: 7.8,
        trending: 7.5,
        friendsCount: 12, // Number of friends who've rated this
      },
    },
    {
      id: '2',
      name: 'Spice Route',
      cuisine: 'Indian',
      rating: 4.6,
      price: '$$$',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      distance: '0.8 mi',
      scores: {
        friendsScore: 7.2,
        groupScore: 8.4,
        trending: 8.8,
        friendsCount: 8,
      },
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return '#10B981';
    if (score >= 7.0) return '#FFB800';
    if (score >= 5.5) return '#FF8E8E';
    return '#DC2626';
  };


  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.greeting}>Loading user...</Text>
          {searching && <ActivityIndicator size="large" color="#FF6B6B" />}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.name}>{user?.user_metadata?.name ? `${user.user_metadata.name}! 👋` : 'Welcome! 👋'}</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.user_metadata?.profile_picture || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.primaryAction}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E8E']}
              style={styles.gradientButton}
            >
              <Plus size={24} color="white" />
              <Text style={styles.primaryActionText}>Start New Session</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push('/discover')}>
              <MapPin size={20} color="#4ECDC4" />
              <Text style={styles.secondaryActionText}>Find Nearby</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction}>
              <Users size={20} color="#A8E6CF" />
              <Text style={styles.secondaryActionText}>Join Session</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentSessions.map((session) => (
            <TouchableOpacity key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionName}>{session.name}</Text>
                <View style={styles.sessionDetails}>
                  <View style={styles.sessionMeta}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.sessionMetaText}>{session.members} members</Text>
                  </View>
                  <View style={styles.sessionMeta}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.sessionMetaText}>{session.time}</Text>
                  </View>
                </View>
                <Text style={styles.restaurantName}>{session.restaurant}</Text>
                
                {/* Score Comparison */}
                <View style={styles.scoreComparison}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Your Score</Text>
                    <Text style={[styles.scoreValue, { color: getScoreColor(session.userScore) }]}>
                      {session.userScore.toFixed(1)}/10
                    </Text>
                  </View>
                  <View style={styles.scoreDivider} />
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Group Score</Text>
                    <Text style={[styles.scoreValue, { color: getScoreColor(session.groupScore) }]}>
                      {session.groupScore.toFixed(1)}/10
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.sessionRating}>
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Text style={styles.rating}>{session.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendations.map((restaurant) => (
              <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                
                {/* Friends Score Badge */}
                <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(restaurant.scores.friendsScore) }]}>
                  <Text style={styles.scoreBadgeText}>{restaurant.scores.friendsScore.toFixed(1)}</Text>
                </View>
                
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
                  
                  {/* Friends & Group Scores */}
                  <View style={styles.restaurantScores}>
                    <View style={styles.restaurantScoreItem}>
                      <Text style={styles.restaurantScoreLabel}>Friends</Text>
                      <Text style={[styles.restaurantScoreValue, { color: getScoreColor(restaurant.scores.friendsScore) }]}>
                        {restaurant.scores.friendsScore.toFixed(1)}
                      </Text>
                      <Text style={styles.friendsCount}>({restaurant.scores.friendsCount})</Text>
                    </View>
                    <View style={styles.restaurantScoreItem}>
                      <Text style={styles.restaurantScoreLabel}>Group</Text>
                      <Text style={[styles.restaurantScoreValue, { color: getScoreColor(restaurant.scores.groupScore) }]}>
                        {restaurant.scores.groupScore.toFixed(1)}
                      </Text>
                    </View>
                    <View style={styles.restaurantScoreItem}>
                      <TrendingUp size={12} color="#6B7280" />
                      <Text style={styles.restaurantScoreValue}>
                        {restaurant.scores.trending.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.restaurantMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFB800" fill="#FFB800" />
                      <Text style={styles.restaurantRating}>{restaurant.rating}</Text>
                    </View>
                    <Text style={styles.price}>{restaurant.price}</Text>
                    <Text style={styles.distance}>{restaurant.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Score Insights */}
        <View style={styles.section}>
          <View style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <BarChart3 size={24} color="#FF6B6B" />
              <Text style={styles.insightsTitle}>Your Taste Profile</Text>
            </View>
            <Text style={styles.insightsText}>
              Based on your dining history, you tend to rate Mediterranean and Japanese cuisine higher than your friends. 
              Your group loves Italian restaurants more than you do.
            </Text>
            <TouchableOpacity style={styles.insightsButton}>
              <Text style={styles.insightsButtonText}>View Full Analysis</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#F3F4F6',
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
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
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  name: {
    fontSize: 24,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  primaryAction: {
    marginBottom: 16,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  primaryActionText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryActionText: {
    color: '#374151',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  seeAll: {
    color: '#FF6B6B',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  sessionDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionMetaText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  restaurantName: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  scoreComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  scoreDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  sessionRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  restaurantCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 16,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  scoreBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 1,
  },
  scoreBadgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  restaurantInfo: {
    padding: 12,
  },
  cuisine: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  restaurantScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  restaurantScoreItem: {
    alignItems: 'center',
    gap: 2,
  },
  restaurantScoreLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  restaurantScoreValue: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  friendsCount: {
    fontSize: 9,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  restaurantRating: {
    fontSize: 12,
    color: '#111827',
    fontFamily: 'Inter-Medium',
  },
  price: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  distance: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  insightsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  insightsTitle: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  insightsText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightsButton: {
    backgroundColor: '#FEF3F2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  insightsButtonText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontFamily: 'Inter-SemiBold',
  },
});