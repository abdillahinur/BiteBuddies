import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, Shield, Users, DollarSign, Utensils, Heart } from 'lucide-react-native';

interface ScoreBreakdownProps {
  restaurant: {
    name: string;
    scores: {
      userScore: number;
      groupScore: number;
      freshness: number;
      hygiene: number;
      popularity: number;
      value: number;
      service: number;
      ambiance: number;
    };
  };
  showUserScore?: boolean;
}

export default function ScoreBreakdown({ restaurant, showUserScore = true }: ScoreBreakdownProps) {
  const scoreCategories = [
    {
      icon: Utensils,
      label: 'Food Quality',
      userScore: restaurant.scores.userScore,
      groupScore: restaurant.scores.groupScore,
      color: '#FF6B6B',
    },
    {
      icon: Users,
      label: 'Service',
      userScore: restaurant.scores.service,
      groupScore: restaurant.scores.service,
      color: '#4ECDC4',
    },
    {
      icon: Heart,
      label: 'Ambiance',
      userScore: restaurant.scores.ambiance,
      groupScore: restaurant.scores.ambiance,
      color: '#A8E6CF',
    },
    {
      icon: DollarSign,
      label: 'Value',
      userScore: restaurant.scores.value,
      groupScore: restaurant.scores.value,
      color: '#FFB800',
    },
    {
      icon: Shield,
      label: 'Hygiene',
      userScore: restaurant.scores.hygiene,
      groupScore: restaurant.scores.hygiene,
      color: '#10B981',
    },
    {
      icon: TrendingUp,
      label: 'Popularity',
      userScore: restaurant.scores.popularity,
      groupScore: restaurant.scores.popularity,
      color: '#8B5CF6',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return '#10B981';
    if (score >= 7.0) return '#FFB800';
    if (score >= 5.5) return '#FF8E8E';
    return '#DC2626';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Score Breakdown</Text>
      <Text style={styles.subtitle}>{restaurant.name}</Text>
      
      <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
        {scoreCategories.map((category, index) => {
          const primaryScore = showUserScore ? category.userScore : category.groupScore;
          const secondaryScore = showUserScore ? category.groupScore : category.userScore;
          
          return (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIcon}>
                  <category.icon size={20} color={category.color} />
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </View>
              
              <View style={styles.scoresRow}>
                <View style={styles.scoreColumn}>
                  <Text style={styles.scoreType}>
                    {showUserScore ? 'Your Score' : 'Group Score'}
                  </Text>
                  <View style={styles.scoreBar}>
                    <View style={styles.scoreBarBackground}>
                      <View 
                        style={[
                          styles.scoreBarFill, 
                          { 
                            width: `${(primaryScore / 10) * 100}%`,
                            backgroundColor: getScoreColor(primaryScore)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.scoreValue, { color: getScoreColor(primaryScore) }]}>
                      {primaryScore.toFixed(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.scoreColumn}>
                  <Text style={styles.scoreType}>
                    {showUserScore ? 'Group Score' : 'Your Score'}
                  </Text>
                  <View style={styles.scoreBar}>
                    <View style={styles.scoreBarBackground}>
                      <View 
                        style={[
                          styles.scoreBarFill, 
                          { 
                            width: `${(secondaryScore / 10) * 100}%`,
                            backgroundColor: getScoreColor(secondaryScore)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.scoreValue, { color: getScoreColor(secondaryScore) }]}>
                      {secondaryScore.toFixed(1)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  categoriesContainer: {
    maxHeight: 400,
  },
  categoryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  scoresRow: {
    flexDirection: 'row',
    gap: 16,
  },
  scoreColumn: {
    flex: 1,
  },
  scoreType: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    minWidth: 32,
    textAlign: 'right',
  },
});