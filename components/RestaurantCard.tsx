import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, MapPin, Clock, Users, TrendingUp } from 'lucide-react-native';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    reviews: number;
    price: string;
    image: string;
    distance: string;
    time: string;
    tags: string[];
    scores: {
      userScore: number;
      groupScore: number;
      overallRating: number;
      freshness: number;
      hygiene: number;
      popularity: number;
      value: number;
      service: number;
      ambiance: number;
      lastUpdated: string;
    };
  };
  onPress?: () => void;
  showGroupScore?: boolean;
}

export default function RestaurantCard({ restaurant, onPress, showGroupScore = false }: RestaurantCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return '#10B981'; // Green
    if (score >= 7.0) return '#FFB800'; // Yellow
    if (score >= 5.5) return '#FF8E8E'; // Orange
    return '#DC2626'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9.0) return 'Exceptional';
    if (score >= 8.0) return 'Excellent';
    if (score >= 7.0) return 'Very Good';
    if (score >= 6.0) return 'Good';
    if (score >= 5.0) return 'Average';
    return 'Below Average';
  };

  const primaryScore = showGroupScore ? restaurant.scores.groupScore : restaurant.scores.userScore;
  const secondaryScore = showGroupScore ? restaurant.scores.userScore : restaurant.scores.groupScore;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      
      {/* Score Badge */}
      <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(primaryScore) }]}>
        <Text style={styles.scoreText}>{primaryScore.toFixed(1)}</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFB800" fill="#FFB800" />
            <Text style={styles.rating}>{restaurant.rating}</Text>
            <Text style={styles.reviews}>({restaurant.reviews})</Text>
          </View>
        </View>
        
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        
        {/* Dual Score Display */}
        <View style={styles.scoresContainer}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>
                {showGroupScore ? 'Group Score' : 'Your Score'}
              </Text>
              <View style={styles.scoreValueContainer}>
                <Text style={[styles.scoreValue, { color: getScoreColor(primaryScore) }]}>
                  {primaryScore.toFixed(1)}/10
                </Text>
                <Text style={styles.scoreDescription}>
                  {getScoreLabel(primaryScore)}
                </Text>
              </View>
            </View>
            
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>
                {showGroupScore ? 'Your Score' : 'Group Score'}
              </Text>
              <View style={styles.scoreValueContainer}>
                <Text style={[styles.scoreValue, { color: getScoreColor(secondaryScore) }]}>
                  {secondaryScore.toFixed(1)}/10
                </Text>
                <Text style={styles.scoreDescription}>
                  {getScoreLabel(secondaryScore)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <TrendingUp size={12} color="#10B981" />
            <Text style={styles.metricText}>Trending</Text>
            <Text style={styles.metricValue}>{restaurant.scores.popularity.toFixed(1)}</Text>
          </View>
          <View style={styles.metric}>
            <Users size={12} color="#4ECDC4" />
            <Text style={styles.metricText}>Service</Text>
            <Text style={styles.metricValue}>{restaurant.scores.service.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <MapPin size={12} color="#6B7280" />
            <Text style={styles.metaText}>{restaurant.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={12} color="#6B7280" />
            <Text style={styles.metaText}>{restaurant.time}</Text>
          </View>
          <Text style={styles.price}>{restaurant.price}</Text>
        </View>
        
        <View style={styles.tagsContainer}>
          {restaurant.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  scoreBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  scoreText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  info: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  cuisine: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  scoresContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 16,
  },
  scoreItem: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  scoreValueContainer: {
    alignItems: 'flex-start',
  },
  scoreValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  scoreDescription: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  metricValue: {
    fontSize: 11,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  price: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-SemiBold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
});