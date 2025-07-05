import * as Location from 'expo-location';

// Simple cuisine-based image selection using high-quality Unsplash images
const getCuisineImage = (cuisine: string, restaurantName: string): string => {
  // Create a simple hash from restaurant name for consistent image selection
  const hash = restaurantName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const cuisineImages: { [key: string]: string[] } = {
    'Italian': [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format', // Pizza
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop&auto=format', // Pasta
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop&auto=format', // Lasagna
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&auto=format', // Risotto
      'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop&auto=format'  // Italian cuisine
    ],
    'Japanese': [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&auto=format', // Sushi
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&auto=format', // Ramen
      'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop&auto=format', // Bento
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&auto=format', // Japanese food
      'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=400&h=300&fit=crop&auto=format'  // Tempura
    ],
    'Mexican': [
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&auto=format', // Tacos
      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop&auto=format', // Burrito
      'https://images.unsplash.com/photo-1565299585323-38174c4a6234?w=400&h=300&fit=crop&auto=format', // Mexican food
      'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&h=300&fit=crop&auto=format', // Quesadilla
      'https://images.unsplash.com/photo-1582169296194-854173ef7d9b?w=400&h=300&fit=crop&auto=format'  // Nachos
    ],
    'Chinese': [
      'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&h=300&fit=crop&auto=format', // Chinese food
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop&auto=format', // Dumplings
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop&auto=format', // Noodles
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&auto=format', // Fried rice
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&auto=format'  // Stir fry
    ],
    'Indian': [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop&auto=format', // Curry
      'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=400&h=300&fit=crop&auto=format', // Indian food
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop&auto=format', // Biryani
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&auto=format', // Naan
      'https://images.unsplash.com/photo-1574653853027-5e4e654de9a4?w=400&h=300&fit=crop&auto=format'  // Tandoori
    ],
    'Thai': [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&auto=format', // Pad Thai
      'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop&auto=format', // Thai curry
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&auto=format', // Thai food
      'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&h=300&fit=crop&auto=format', // Tom yum
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&auto=format'  // Thai stir fry
    ],
    'American': [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format', // Burger
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format', // Pizza
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&auto=format', // BBQ
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&auto=format', // Sandwich
      'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop&auto=format'  // American food
    ],
    'French': [
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&auto=format', // French food
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format', // Croissant
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format', // French cuisine
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&auto=format', // French dish
      'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop&auto=format'  // French bistro
    ],
    'Mediterranean': [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&auto=format', // Mediterranean
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&auto=format', // Greek food
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format', // Hummus
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&auto=format', // Falafel
      'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop&auto=format'  // Mediterranean salad
    ],
    'Korean': [
      'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=400&h=300&fit=crop&auto=format', // Korean BBQ
      'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&h=300&fit=crop&auto=format', // Kimchi
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&auto=format', // Korean food
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&auto=format', // Bibimbap
      'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop&auto=format'  // Korean hot pot
    ]
  };

  // Get images for the cuisine or default to general food images
  const images = cuisineImages[cuisine] || [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format', // General food
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&auto=format', // Restaurant
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&auto=format', // Dining
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop&auto=format', // Food plate
    'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop&auto=format'  // Meal
  ];

  // Select image based on restaurant name hash for consistency
  const imageIndex = hash % images.length;
  return images[imageIndex];
};

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
  address: string;
  phone?: string;
  website?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
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
}

// Calculate distance between two coordinates
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Build Overpass API query for restaurants
const buildOverpassQuery = (lat: number, lng: number, radiusKm: number): string => {
  const radiusMeters = radiusKm * 1000;
  return `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      way["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      relation["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
      way["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
      node["amenity"="fast_food"](around:${radiusMeters},${lat},${lng});
      way["amenity"="fast_food"](around:${radiusMeters},${lat},${lng});
      node["amenity"="bar"](around:${radiusMeters},${lat},${lng});
      way["amenity"="bar"](around:${radiusMeters},${lat},${lng});
      node["amenity"="pub"](around:${radiusMeters},${lat},${lng});
      way["amenity"="pub"](around:${radiusMeters},${lat},${lng});
    );
    out geom;
  `;
};

// Parse Overpass API response into Restaurant objects
const parseOverpassResponse = (data: any, userLat: number, userLng: number): Restaurant[] => {
  const restaurants: Restaurant[] = [];
  
  if (!data.elements || !Array.isArray(data.elements)) {
    return restaurants;
  }

  // Process restaurants with image fetching
  for (let index = 0; index < data.elements.length; index++) {
    const element = data.elements[index];
    const tags = element.tags || {};
    const name = tags.name || tags['name:en'] || 'Unknown Restaurant';
    
    // Skip if no name
    if (!name || name === 'Unknown Restaurant') continue;

    // Get coordinates
    let lat = element.lat;
    let lng = element.lon;
    
    // For ways, use the center point
    if (!lat && !lng && element.geometry && element.geometry.length > 0) {
      const coords = element.geometry;
      lat = coords.reduce((sum: number, coord: any) => sum + coord.lat, 0) / coords.length;
      lng = coords.reduce((sum: number, coord: any) => sum + coord.lon, 0) / coords.length;
    }
    
    if (!lat || !lng) continue;

    // Calculate distance
    const distance = calculateDistance(userLat, userLng, lat, lng);

    // Map cuisine types
    const cuisineMap: { [key: string]: string } = {
      'pizza': 'Italian',
      'italian': 'Italian',
      'chinese': 'Chinese',
      'japanese': 'Japanese',
      'sushi': 'Japanese',
      'indian': 'Indian',
      'mexican': 'Mexican',
      'thai': 'Thai',
      'greek': 'Greek',
      'mediterranean': 'Mediterranean',
      'french': 'French',
      'american': 'American',
      'korean': 'Korean',
      'vietnamese': 'Vietnamese',
      'turkish': 'Turkish',
      'lebanese': 'Lebanese',
      'seafood': 'Seafood',
      'steakhouse': 'American',
      'burger': 'American',
      'sandwich': 'American',
      'barbecue': 'American',
      'regional': 'Regional'
    };

    const rawCuisine = tags.cuisine || '';
    let cuisine = 'International';
    
    // Check for cuisine in tags
    if (rawCuisine) {
      const cuisineKey = rawCuisine.toLowerCase().split(';')[0].trim();
      cuisine = cuisineMap[cuisineKey] || cuisine;
    }
    
    // Infer cuisine from name if not found in tags
    if (cuisine === 'International') {
      const nameLower = name.toLowerCase();
      for (const [key, value] of Object.entries(cuisineMap)) {
        if (nameLower.includes(key)) {
          cuisine = value;
          break;
        }
      }
    }

    // Build address
    const addressParts = [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:city'] || tags['addr:town'],
      tags['addr:province'] || tags['addr:state']
    ].filter(Boolean);
    
    const address = addressParts.length > 0 
      ? addressParts.join(' ') 
      : `${Math.floor(Math.random() * 999) + 1} Main St, Ottawa, ON`;

    // Generate realistic ratings and review counts
    const rating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0 to 5.0
    const reviewCount = Math.floor(Math.random() * 300) + 10;

    // Generate price range
    const priceRanges = ['$', '$$', '$$$', '$$$$'];
    const price = priceRanges[Math.floor(Math.random() * priceRanges.length)];

    // Determine dietary tags based on cuisine and amenity type
    const dietaryTags: string[] = [];
    if (tags.amenity === 'cafe') dietaryTags.push('Vegetarian');
    if (cuisine === 'Indian' && Math.random() < 0.5) dietaryTags.push('Vegetarian');
    if (cuisine === 'Mediterranean' && Math.random() < 0.3) dietaryTags.push('Vegetarian');
    if (tags['diet:vegetarian'] === 'yes') dietaryTags.push('Vegetarian');
    if (tags['diet:vegan'] === 'yes') dietaryTags.push('Vegan');
    if (tags['diet:halal'] === 'yes') dietaryTags.push('Halal');
    if (tags['diet:kosher'] === 'yes') dietaryTags.push('Kosher');
    if (tags['diet:gluten_free'] === 'yes') dietaryTags.push('Gluten-Free');

    // Generate estimated travel time
    const timeMinutes = Math.round(distance * 3 + Math.random() * 5); // ~3 min per km + random
    const time = `${timeMinutes} min`;

    const restaurantImage = getCuisineImage(cuisine, name);

    // Generate scores
    const baseScore = rating * 20; // Convert 5-star to 100-point scale
    const scores = {
      userScore: Math.round(baseScore + (Math.random() - 0.5) * 10),
      groupScore: Math.round(baseScore + (Math.random() - 0.5) * 15),
      overallRating: Math.round(baseScore + (Math.random() - 0.5) * 8),
      freshness: Math.round(70 + Math.random() * 30),
      hygiene: Math.round(75 + Math.random() * 25),
      popularity: Math.round(Math.min(reviewCount / 5, 100)),
      value: Math.round(80 + (Math.random() - 0.5) * 30),
      service: Math.round(baseScore + (Math.random() - 0.5) * 12),
      ambiance: Math.round(baseScore + (Math.random() - 0.5) * 20),
      lastUpdated: new Date().toISOString()
    };

    restaurants.push({
      id: `osm-${element.id || index}`,
      name,
      cuisine,
      rating,
      reviews: reviewCount,
      price,
      image: restaurantImage,
      distance: `${distance.toFixed(1)} km`,
      time,
      tags: dietaryTags,
      address,
      phone: tags.phone || undefined,
      website: tags.website || undefined,
      coordinates: {
        latitude: lat,
        longitude: lng
      },
      scores
    });
  }

  return restaurants.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
};

// Filter restaurants based on criteria
const filterRestaurants = (
  restaurants: Restaurant[],
  radiusKm: number,
  cuisineFilters: string[] = [],
  dietaryFilters: string[] = []
): Restaurant[] => {
  return restaurants.filter(restaurant => {
    // Distance filter
    const distance = parseFloat(restaurant.distance);
    if (distance > radiusKm) return false;

    // Cuisine filter
    if (cuisineFilters.length > 0 && !cuisineFilters.includes(restaurant.cuisine)) {
      return false;
    }

    // Dietary filter
    if (dietaryFilters.length > 0) {
      const hasRequiredDiet = dietaryFilters.some(diet => 
        restaurant.tags.includes(diet)
      );
      if (!hasRequiredDiet) return false;
    }

    return true;
  });
};

// Search restaurants using Overpass API
const searchRestaurantsWithOverpass = async (
  latitude: number,
  longitude: number,
  radius: number,
  cuisineFilters: string[] = [],
  dietaryFilters: string[] = []
): Promise<Restaurant[]> => {
  console.log(`Searching restaurants with Overpass API at ${latitude}, ${longitude} within ${radius}km`);
  
  try {
    const query = buildOverpassQuery(latitude, longitude, radius);
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    const restaurants = parseOverpassResponse(data, latitude, longitude);
    
    console.log(`Found ${restaurants.length} restaurants from OpenStreetMap`);
    
    return filterRestaurants(restaurants, radius, cuisineFilters, dietaryFilters);
  } catch (error) {
    console.error('Error fetching restaurants from Overpass API:', error);
    throw error;
  }
};

// Main function to fetch nearby restaurants
export const fetchNearbyRestaurants = async (
  location: Location.LocationObject,
  radius: number,
  cuisineFilters: string[] = [],
  dietaryFilters: string[] = []
): Promise<Restaurant[]> => {
  const { latitude, longitude } = location.coords;
  
  // Convert radius from meters to kilometers
  const radiusKm = radius / 1000;
  
  try {
    return await searchRestaurantsWithOverpass(latitude, longitude, radiusKm, cuisineFilters, dietaryFilters);
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    throw error;
  }
};

// Get a high-quality cuisine image for a restaurant (already handled in getCuisineImage)
export const fetchRestaurantImage = async (restaurant: Restaurant): Promise<string> => {
  // Images are already optimized and cuisine-specific, no need for additional fetching
  return restaurant.image;
};

// Paginate restaurants
export const getPaginatedRestaurants = (
  restaurants: Restaurant[],
  page: number = 0,
  pageSize: number = 5
): { restaurants: Restaurant[]; hasMore: boolean } => {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRestaurants = restaurants.slice(startIndex, endIndex);
  const hasMore = endIndex < restaurants.length;

  return {
    restaurants: paginatedRestaurants,
    hasMore
  };
}; 