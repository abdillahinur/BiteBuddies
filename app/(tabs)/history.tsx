import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Platform } from 'react-native';
import { useRef } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Star, Calendar, MapPin, CreditCard as Edit3, Trash2, Camera } from 'lucide-react-native';
import { useState } from 'react';

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Recent', 'Favorites', 'To Review'];

  const [diningHistory, setDiningHistory] = useState([
    {
      id: '1',
      restaurant: {
        name: 'Sakura Sushi',
        cuisine: 'Japanese',
        image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=400',
        location: 'Downtown',
      },
      visitDate: '2024-01-10',
      myRating: {
        overall: 9,
        food: 9,
        service: 8,
        ambiance: 9,
        value: 8,
      },
      review: 'Absolutely incredible omakase experience. The chef was amazing and every piece was perfect.',
      wouldRecommend: true,
      sessionId: 'session-1',
      sessionName: 'Team Lunch',
      images: ['https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=200'],
    },
    {
      id: '2',
      restaurant: {
        name: 'Bella Vista',
        cuisine: 'Italian',
        image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
        location: 'Little Italy',
      },
      visitDate: '2024-01-08',
      myRating: {
        overall: 6,
        food: 7,
        service: 7,
        ambiance: 8,
        value: 5,
      },
      review: 'Beautiful atmosphere but overpriced for the portion sizes. Service was good though.',
      wouldRecommend: false,
      sessionId: 'session-2',
      sessionName: 'Date Night',
      images: [],
    },
    {
      id: '3',
      restaurant: {
        name: 'The Garden Cafe',
        cuisine: 'Mediterranean',
        image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
        location: 'Midtown',
      },
      visitDate: '2024-01-05',
      myRating: {
        overall: 8,
        food: 8,
        service: 8,
        ambiance: 8,
        value: 8,
      },
      review: 'Fresh ingredients and healthy options. Perfect for lunch meetings.',
      wouldRecommend: true,
      sessionId: null,
      sessionName: null,
      images: ['https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=200'],
    },
  ]);

  // State for new restaurant form
  const [showDatePicker, setShowDatePicker] = useState(false);
  type RatingKey = 'overall' | 'food' | 'service' | 'ambiance' | 'value';

  type NewRestaurant = {
    name: string;
    cuisine: string;
    visitDate: string;
    overall: string;
    food: string;
    service: string;
    ambiance: string;
    value: string;
    review: string;
    wouldRecommend: boolean;
    location: string;
    images: string[];
  };

  const emptyRestaurant: NewRestaurant = {
    name: '',
    cuisine: '',
    visitDate: '',
    overall: '',
    food: '',
    service: '',
    ambiance: '',
    value: '',
    review: '',
    wouldRecommend: true,
    location: '',
    images: [],
  };

  const [newRestaurant, setNewRestaurant] = useState<NewRestaurant>({ ...emptyRestaurant });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleSaveRestaurant = () => {
    if (editIndex !== null) {
      // Edit existing
      setDiningHistory(prev => {
        const updated = [...prev];
        updated[editIndex] = {
          ...updated[editIndex],
          restaurant: {
            name: newRestaurant.name,
            cuisine: newRestaurant.cuisine,
            image: newRestaurant.images[0] || 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=400',
            location: newRestaurant.location || 'Unknown',
          },
          visitDate: newRestaurant.visitDate || new Date().toISOString().slice(0, 10),
          myRating: {
            overall: parseFloat(newRestaurant.overall) || 0,
            food: parseFloat(newRestaurant.food) || 0,
            service: parseFloat(newRestaurant.service) || 0,
            ambiance: parseFloat(newRestaurant.ambiance) || 0,
            value: parseFloat(newRestaurant.value) || 0,
          },
          review: newRestaurant.review,
          wouldRecommend: newRestaurant.wouldRecommend,
          // sessionId, sessionName, images remain unchanged or can be updated as needed
        };
        return updated;
      });
    } else {
      // Add new
      setDiningHistory([
        {
          id: (diningHistory.length + 1).toString(),
          restaurant: {
            name: newRestaurant.name,
            cuisine: newRestaurant.cuisine,
            image: newRestaurant.images[0] || 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=400',
            location: newRestaurant.location || 'Unknown',
          },
          visitDate: newRestaurant.visitDate || new Date().toISOString().slice(0, 10),
          myRating: {
            overall: parseFloat(newRestaurant.overall) || 0,
            food: parseFloat(newRestaurant.food) || 0,
            service: parseFloat(newRestaurant.service) || 0,
            ambiance: parseFloat(newRestaurant.ambiance) || 0,
            value: parseFloat(newRestaurant.value) || 0,
          },
          review: newRestaurant.review,
          wouldRecommend: newRestaurant.wouldRecommend,
          sessionId: null,
          sessionName: null,
          images: newRestaurant.images,
        },
        ...diningHistory,
      ]);
    }
    setShowAddModal(false);
    setNewRestaurant({ ...emptyRestaurant });
    setEditIndex(null);
  };

  const handleEdit = (entry: any, index: number) => {
    setEditIndex(index);
    setNewRestaurant({
      name: entry.restaurant.name,
      cuisine: entry.restaurant.cuisine,
      visitDate: entry.visitDate,
      overall: entry.myRating.overall.toString(),
      food: entry.myRating.food.toString(),
      service: entry.myRating.service.toString(),
      ambiance: entry.myRating.ambiance.toString(),
      value: entry.myRating.value.toString(),
      review: entry.review,
      wouldRecommend: entry.wouldRecommend,
      location: entry.restaurant.location,
      images: entry.images || [],
    });
    setShowAddModal(true);
  };

  const handleDelete = (index: number) => {
    setDiningHistory(prev => prev.filter((_, i) => i !== index));
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return '#10B981';
    if (score >= 7.0) return '#FFB800';
    if (score >= 5.5) return '#FF8E8E';
    return '#DC2626';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9.0) return 'Exceptional';
    if (score >= 8.0) return 'Excellent';
    if (score >= 7.0) return 'Very Good';
    if (score >= 6.0) return 'Good';
    if (score >= 5.0) return 'Average';
    return 'Below Average';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Dining History</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Restaurants</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8.2</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your dining history..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
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

        {/* History List */}
        <View style={styles.historyList}>
          {diningHistory.map((entry, idx) => (
            <TouchableOpacity key={entry.id} style={styles.historyCard}>
              <Image source={{ uri: entry.restaurant.image }} style={styles.restaurantImage} />
              {/* Score Badge (average of all scores) */}
              {(() => {
                const ratings = [entry.myRating.food, entry.myRating.service, entry.myRating.ambiance, entry.myRating.value, entry.myRating.overall];
                const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                return (
                  <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(avg) }]}> 
                    <Text style={styles.scoreBadgeText}>{avg.toFixed(1)}</Text>
                  </View>
                );
              })()}

              <View style={styles.historyInfo}>
                <View style={styles.historyHeader}>
                  <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{entry.restaurant.name}</Text>
                    <Text style={styles.cuisine}>{entry.restaurant.cuisine}</Text>
                  </View>
                  <View style={styles.historyActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(entry, idx)}>
                      <Edit3 size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(idx)}>
                      <Trash2 size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Visit Details */}
                <View style={styles.visitDetails}>
                  <View style={styles.visitMeta}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.visitDate}>{formatDate(entry.visitDate)}</Text>
                  </View>
                  <View style={styles.visitMeta}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.location}>{entry.restaurant.location}</Text>
                  </View>
                  {entry.sessionName && (
                    <Text style={styles.sessionName}>via {entry.sessionName}</Text>
                  )}
                </View>

                {/* Rating Breakdown */}
                <View style={styles.ratingBreakdown}>
                  <View style={styles.overallRating}>
                    {(() => {
                      const ratings = [entry.myRating.food, entry.myRating.service, entry.myRating.ambiance, entry.myRating.value, entry.myRating.overall];
                      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                      return (
                        <>
                          <Text style={[styles.overallScore, { color: getScoreColor(avg) }]}> 
                            {avg.toFixed(1)}/10
                          </Text>
                          <Text style={styles.scoreLabel}>
                            {getScoreLabel(avg)}
                          </Text>
                        </>
                      );
                    })()}
                  </View>
                  
                  <View style={styles.categoryRatings}>
                    <View style={styles.categoryRating}>
                      <Text style={styles.categoryLabel}>Food</Text>
                      <Text style={styles.categoryScore}>{entry.myRating.food.toFixed(1)}</Text>
                    </View>
                    <View style={styles.categoryRating}>
                      <Text style={styles.categoryLabel}>Service</Text>
                      <Text style={styles.categoryScore}>{entry.myRating.service.toFixed(1)}</Text>
                    </View>
                    <View style={styles.categoryRating}>
                      <Text style={styles.categoryLabel}>Ambiance</Text>
                      <Text style={styles.categoryScore}>{entry.myRating.ambiance.toFixed(1)}</Text>
                    </View>
                    <View style={styles.categoryRating}>
                      <Text style={styles.categoryLabel}>Value</Text>
                      <Text style={styles.categoryScore}>{entry.myRating.value.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>

                {/* Review */}
                {entry.review && (
                  <Text style={styles.review} numberOfLines={2}>
                    "{entry.review}"
                  </Text>
                )}

                {/* Recommendation */}
                <View style={styles.recommendation}>
                  <Star 
                    size={16} 
                    color={entry.wouldRecommend ? '#FFB800' : '#E5E7EB'} 
                    fill={entry.wouldRecommend ? '#FFB800' : 'none'} 
                  />
                  <Text style={[styles.recommendText, { color: entry.wouldRecommend ? '#111827' : '#6B7280' }]}>
                    {entry.wouldRecommend ? 'Would recommend' : 'Would not recommend'}
                  </Text>
                </View>

                {/* Photos */}
                {entry.images.length > 0 && (
                  <View style={styles.photosContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {entry.images.map((image, index) => (
                        <Image key={index} source={{ uri: image }} style={styles.photo} />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Restaurant Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAddModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Restaurant</Text>
              <TouchableOpacity>
                <Text style={styles.modalSave} onPress={handleSaveRestaurant}>Save</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalSectionTitle}>Restaurant Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Restaurant Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter restaurant name"
                  placeholderTextColor="#9CA3AF"
                  value={newRestaurant.name}
                  onChangeText={text => setNewRestaurant(r => ({ ...r, name: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cuisine Type</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Italian, Japanese, Mexican"
                  placeholderTextColor="#9CA3AF"
                  value={newRestaurant.cuisine}
                  onChangeText={text => setNewRestaurant(r => ({ ...r, cuisine: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Visit Date</Text>
                {Platform.OS === 'web' ? (
                  <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center', paddingVertical: 0 }]}> 
                    <Calendar size={20} color="#6B7280" />
                    <input
                      type="date"
                      style={{
                        marginLeft: 8,
                        border: 'none',
                        outline: 'none',
                        fontSize: 16,
                        color: newRestaurant.visitDate ? '#111827' : '#9CA3AF',
                        backgroundColor: 'transparent',
                        fontFamily: 'Inter-Regular',
                        flex: 1,
                        height: 40,
                      }}
                      value={newRestaurant.visitDate}
                      onChange={e => setNewRestaurant(r => ({ ...r, visitDate: e.target.value }))}
                    />
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.8}
                    >
                      <Calendar size={20} color="#6B7280" />
                      <Text style={{ marginLeft: 8, color: newRestaurant.visitDate ? '#111827' : '#9CA3AF', fontSize: 16 }}>
                        {newRestaurant.visitDate ? new Date(newRestaurant.visitDate).toLocaleDateString() : 'Select date'}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={newRestaurant.visitDate ? new Date(newRestaurant.visitDate) : new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                          if (Platform.OS === 'android') {
                            setShowDatePicker(false);
                          }
                          if (selectedDate) {
                            setNewRestaurant(r => ({ ...r, visitDate: selectedDate.toISOString().slice(0, 10) }));
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </View>

              {([
                { key: 'overall', label: 'Overall' },
                { key: 'food', label: 'Food Quality' },
                { key: 'service', label: 'Service' },
                { key: 'ambiance', label: 'Ambiance' },
                { key: 'value', label: 'Value' },
              ] as { key: RatingKey; label: string }[]).map(({ key, label }) => (
                <View key={key} style={styles.ratingInput}>
                  <Text style={styles.ratingLabel}>{label}</Text>
                  <View style={{ flexDirection: 'row', gap: 4, marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                    {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: parseInt(newRestaurant[key]) === num ? '#FF6B6B' : '#F3F4F6',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: parseInt(newRestaurant[key]) === num ? 2 : 1,
                          borderColor: parseInt(newRestaurant[key]) === num ? '#FF6B6B' : '#E5E7EB',
                        }}
                        onPress={() => setNewRestaurant(r => ({ ...r, [key]: num.toString() }))}
                      >
                        <Text style={{ color: parseInt(newRestaurant[key]) === num ? 'white' : '#6B7280', fontWeight: 'bold' }}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Review (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Share your experience..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  value={newRestaurant.review}
                  onChangeText={text => setNewRestaurant(r => ({ ...r, review: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Would Recommend?</Text>
                <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8, alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: newRestaurant.wouldRecommend ? '#10B981' : '#F3F4F6',
                      paddingVertical: 12,
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: newRestaurant.wouldRecommend ? '#10B981' : '#E5E7EB',
                    }}
                    onPress={() => setNewRestaurant(r => ({ ...r, wouldRecommend: true }))}
                  >
                    <Text style={{ color: newRestaurant.wouldRecommend ? 'white' : '#6B7280', fontFamily: 'Inter-SemiBold', fontSize: 16 }}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: !newRestaurant.wouldRecommend ? '#DC2626' : '#F3F4F6',
                      paddingVertical: 12,
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: !newRestaurant.wouldRecommend ? '#DC2626' : '#E5E7EB',
                    }}
                    onPress={() => setNewRestaurant(r => ({ ...r, wouldRecommend: false }))}
                  >
                    <Text style={{ color: !newRestaurant.wouldRecommend ? 'white' : '#6B7280', fontFamily: 'Inter-SemiBold', fontSize: 16 }}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Downtown, Midtown"
                  placeholderTextColor="#9CA3AF"
                  value={newRestaurant.location}
                  onChangeText={text => setNewRestaurant(r => ({ ...r, location: text }))}
                />
              </View>

              {/* Image Upload Section */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Upload Photos</Text>
                {Platform.OS === 'web' ? (
                  (() => {
                    // Use a ref to trigger the hidden file input
                    const fileInputId = 'file-upload-input';
                    return (
                      <>
                        <input
                          id={fileInputId}
                          type="file"
                          accept="image/*"
                          multiple
                          style={{ display: 'none' }}
                          onChange={e => {
                            const files = e.target.files;
                            if (files) {
                              const fileArray = Array.from(files);
                              Promise.all(
                                fileArray.map(file => {
                                  return new Promise<string>((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = () => resolve(reader.result as string);
                                    reader.onerror = reject;
                                    reader.readAsDataURL(file);
                                  });
                                })
                              ).then(imgs => {
                                setNewRestaurant(r => ({ ...r, images: imgs }));
                              });
                            }
                          }}
                        />
                        <button
                          type="button"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: '16px',
                            borderWidth: 2,
                            borderColor: '#E5E7EB',
                            borderStyle: 'dashed',
                            gap: 8,
                            cursor: 'pointer',
                            fontFamily: 'Inter-Medium',
                            color: '#6B7280',
                            fontSize: 14,
                            marginBottom: 12,
                          }}
                          onClick={() => {
                            const input = document.getElementById(fileInputId) as HTMLInputElement;
                            if (input) input.click();
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
                            <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="13" r="3"/><path d="M5 7h.01M21 15V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="m21 21-4.35-4.35"/></svg>
                          </span>
                          Add Photos
                        </button>
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                          {newRestaurant.images && newRestaurant.images.map((img: string, idx: number) => (
                            <img key={idx} src={img} alt="preview" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', marginRight: 8, marginBottom: 8 }} />
                          ))}
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={() => {
                      // TODO: Connect to native image picker (e.g., expo-image-picker)
                      alert('Image picker not implemented for native. Use expo-image-picker or similar.');
                    }}
                  >
                    <Camera size={20} color="#6B7280" />
                    <Text style={styles.photoButtonText}>Add Photos</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </ScrollView>
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
  addButton: {
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginTop: 4,
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
  historyList: {
    paddingHorizontal: 20,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  scoreBadgeText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  historyInfo: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  cuisine: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  historyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  visitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  visitDate: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  location: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  sessionName: {
    fontSize: 12,
    color: '#FF6B6B',
    fontFamily: 'Inter-Medium',
  },
  ratingBreakdown: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  overallRating: {
    alignItems: 'center',
    marginBottom: 12,
  },
  overallScore: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  categoryRatings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryRating: {
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  categoryScore: {
    fontSize: 12,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  review: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  recommendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  photosContainer: {
    marginTop: 8,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  modalTitle: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  modalSave: {
    fontSize: 16,
    color: '#FF6B6B',
    fontFamily: 'Inter-SemiBold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  ratingInput: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  starNumber: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-SemiBold',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
});