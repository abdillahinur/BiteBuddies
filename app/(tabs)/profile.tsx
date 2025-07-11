import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, CreditCard as Edit, Star, Users, MapPin, Share2, Bell, Shield, LogOut } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProfileScreen() {

  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optionally, you can fetch stats and preferences from Supabase as well
  const stats = [
    { label: 'Sessions', value: '24', icon: Users },
    { label: 'Reviews', value: '18', icon: Star },
    { label: 'Places', value: '47', icon: MapPin },
  ];

  const [preferences, setPreferences] = useState<any>(null);

  const menuItems = [
    { icon: Bell, title: 'Notifications', subtitle: 'Session updates and reminders', hasSwitch: true, value: notifications, onToggle: setNotifications },
    { icon: MapPin, title: 'Location Sharing', subtitle: 'Share location with friends', hasSwitch: true, value: locationSharing, onToggle: setLocationSharing },
    { icon: Share2, title: 'Invite Friends', subtitle: 'Share BiteBuddies with friends' },
    { icon: Star, title: 'Rate App', subtitle: 'Help us improve BiteBuddies' },
    { icon: Shield, title: 'Privacy', subtitle: 'Manage your privacy settings' },
    { icon: Settings, title: 'Settings', subtitle: 'App preferences and more' },
  ];

  useEffect(() => {
    const fetchUserAndPreferences = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('name', 'KJ')
          .single();
        if (userError) throw userError;
        setUser(userData);

        // Fetch preferences for user
        if (userData && userData.id) {
          const { data: prefData, error: prefError } = await supabase
            .from('preferences')
            .select('*')
            .eq('user_id', userData.id)
            .single();
          if (prefError) {
            setPreferences(null);
          } else {
            setPreferences(prefData);
          }
        } else {
          setPreferences(null);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user');
        setUser(null);
        setPreferences(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndPreferences();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          ) : user ? (
            <>
              <View style={styles.profileImageContainer}>
                {user.avatar_url || user.profile_picture ? (
                  <Image
                    source={{ uri: user.avatar_url || user.profile_picture }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={[styles.profileImage, { backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center' }]}> 
                    <Text style={{ color: 'white', fontSize: 40, fontFamily: 'Inter-Bold' }}>
                      {user.name && user.name.length > 0 ? user.name[0].toUpperCase() : '?'}
                    </Text>
                  </View>
                )}
                <View style={styles.onlineIndicator} />
              </View>
              <Text style={styles.name}>{user.name || 'No Name'}</Text>
              <Text style={styles.email}>{user.email || 'No Email'}</Text>
              <Text style={styles.joinDate}>
                Member since {user.created_at ? new Date(user.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Unknown'}
              </Text>
            </>
          ) : (
            <Text>User not found</Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statCard}>
              <stat.icon size={24} color="#FF6B6B" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {loading ? (
            <Text>Loading...</Text>
          ) : preferences ? (
            <>
              {preferences.dietary_restrictions && preferences.dietary_restrictions.length > 0 && (
                <View style={styles.preferenceCard}>
                  <Text style={styles.preferenceCategory}>Dietary Restrictions</Text>
                  <View style={styles.preferenceItems}>
                    {preferences.dietary_restrictions.map((item: string, idx: number) => (
                      <View key={idx} style={styles.preferenceTag}>
                        <Text style={styles.preferenceTagText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {preferences.cuisine_likes && preferences.cuisine_likes.length > 0 && (
                <View style={styles.preferenceCard}>
                  <Text style={styles.preferenceCategory}>Cuisine Likes</Text>
                  <View style={styles.preferenceItems}>
                    {preferences.cuisine_likes.map((item: string, idx: number) => (
                      <View key={idx} style={styles.preferenceTag}>
                        <Text style={styles.preferenceTagText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {preferences.cuisine_dislikes && preferences.cuisine_dislikes.length > 0 && (
                <View style={styles.preferenceCard}>
                  <Text style={styles.preferenceCategory}>Cuisine Dislikes</Text>
                  <View style={styles.preferenceItems}>
                    {preferences.cuisine_dislikes.map((item: string, idx: number) => (
                      <View key={idx} style={styles.preferenceTag}>
                        <Text style={styles.preferenceTagText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {preferences.allergies && preferences.allergies.length > 0 && (
                <View style={styles.preferenceCard}>
                  <Text style={styles.preferenceCategory}>Allergies</Text>
                  <View style={styles.preferenceItems}>
                    {preferences.allergies.map((item: string, idx: number) => (
                      <View key={idx} style={styles.preferenceTag}>
                        <Text style={styles.preferenceTagText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              <View style={styles.preferenceCard}>
                <Text style={styles.preferenceCategory}>Price Range</Text>
                <View style={styles.preferenceItems}>
                  <View style={styles.preferenceTag}>
                    <Text style={styles.preferenceTagText}>{preferences.price_range ? `$${preferences.price_range}` : 'N/A'}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.preferenceCard}>
                <Text style={styles.preferenceCategory}>Distance Range (km)</Text>
                <View style={styles.preferenceItems}>
                  <View style={styles.preferenceTag}>
                    <Text style={styles.preferenceTagText}>{preferences.distance_range_km ?? 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <Text>No preferences found.</Text>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <item.icon size={20} color="#6B7280" />
                </View>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              {item.hasSwitch && (
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: '#E5E7EB', true: '#FF6B6B' }}
                  thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>BiteBuddies v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for food lovers</Text>
        </View>
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
  editButton: {
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
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
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
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
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
  preferenceCard: {
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
  preferenceCategory: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  preferenceItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceTag: {
    backgroundColor: '#FEF3F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD1D1',
  },
  preferenceTagText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontFamily: 'Inter-Medium',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    color: '#DC2626',
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
});