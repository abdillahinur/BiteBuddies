export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: UserPreferences;
  joinedAt: string;
}

export interface UserPreferences {
  dietary: string[];
  cuisines: string[];
  priceRange: string[];
  restrictions: string[];
}

export interface Restaurant {
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
  location: {
    latitude: number;
    longitude: number;
  };
  scores: RestaurantScores;
}

export interface RestaurantScores {
  userScore: number; // Individual user's score out of 10
  groupScore: number; // Combined group score out of 10
  overallRating: number; // Public rating (e.g., from Google/Yelp)
  freshness: number; // Based on recent reviews/complaints
  hygiene: number; // Health inspection scores
  popularity: number; // Social buzz and trending
  value: number; // Price vs quality ratio
  service: number; // Service quality score
  ambiance: number; // Atmosphere and vibe score
  lastUpdated: string;
}

export interface UserRestaurantRating {
  userId: string;
  restaurantId: string;
  overallScore: number; // Out of 10
  foodQuality: number;
  service: number;
  ambiance: number;
  value: number;
  wouldRecommend: boolean;
  review?: string;
  visitDate: string;
  images?: string[];
}

export interface GroupRestaurantScore {
  restaurantId: string;
  groupId: string;
  averageScore: number; // Average of all group members' scores
  memberScores: {
    userId: string;
    score: number;
    weight: number; // Based on user's rating history reliability
  }[];
  consensusLevel: number; // How much the group agrees (0-10)
  lastCalculated: string;
}

export interface Session {
  id: string;
  name: string;
  createdBy: string;
  members: SessionMember[];
  status: 'voting' | 'decided' | 'completed';
  restaurants: Restaurant[];
  votes: Vote[];
  decidedRestaurant?: string;
  scheduledTime?: string;
  createdAt: string;
  expiresAt?: string;
  groupScores?: GroupRestaurantScore[];
}

export interface SessionMember {
  id: string;
  name: string;
  avatar: string;
  preferences: UserPreferences;
  joinedAt: string;
  reliabilityScore: number; // How reliable their ratings are (0-10)
}

export interface Vote {
  userId: string;
  restaurantId: string;
  score: number;
  timestamp: string;
  reasoning?: string;
}

export interface DiningHistory {
  id: string;
  userId: string;
  restaurantId: string;
  sessionId?: string;
  rating: UserRestaurantRating;
  date: string;
}

export interface ScoreBreakdown {
  category: string;
  userScore: number;
  groupScore: number;
  weight: number;
  description: string;
}