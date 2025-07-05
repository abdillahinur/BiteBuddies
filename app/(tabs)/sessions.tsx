import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, Clock, MapPin, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SessionsScreen() {
  const activeSessions = [
    {
      id: '1',
      name: 'Weekend Brunch',
      members: [
        { id: '1', name: 'You', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: '2', name: 'Alex', avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=100' },
        { id: '3', name: 'Emma', avatar: 'https://images.pexels.com/photos/1689731/pexels-photo-1689731.jpeg?auto=compress&cs=tinysrgb&w=100' },
      ],
      status: 'voting',
      timeLeft: '2h 30m',
      topChoice: 'Pancake Paradise',
      votes: 3,
      totalVotes: 3,
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
          <TouchableOpacity style={styles.createButton}>
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Create Session Card */}
        <TouchableOpacity style={styles.createSessionCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            style={styles.createSessionGradient}
          >
            <Plus size={32} color="white" />
            <Text style={styles.createSessionTitle}>Create New Session</Text>
            <Text style={styles.createSessionSubtitle}>
              Start a group dining experience
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Active Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          {activeSessions.map((session) => (
            <TouchableOpacity key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionName}>{session.name}</Text>
                <View style={styles.sessionStatus}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: session.status === 'voting' ? '#FFB800' : '#10B981' }
                  ]} />
                  <Text style={styles.statusText}>
                    {session.status === 'voting' ? 'Voting' : 'Decided'}
                  </Text>
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
            </TouchableOpacity>
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
});