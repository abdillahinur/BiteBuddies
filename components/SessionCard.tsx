import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Users, Clock, MapPin, Share2 } from 'lucide-react-native';

interface SessionCardProps {
  session: {
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
  };
  onPress?: () => void;
  onShare?: () => void;
}

export default function SessionCard({ session, onPress, onShare }: SessionCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{session.name}</Text>
        <View style={styles.statusContainer}>
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

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>
            {session.status === 'voting' ? 'Vote Now' : 'View Details'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Share2 size={16} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  statusContainer: {
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
  actions: {
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
});