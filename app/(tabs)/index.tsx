import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Bell } from 'lucide-react-native';
import PostCard from '../../components/PostCard';
import { useFeedStore } from '../../store/useFeedStore';
import { useColorScheme } from '../../hooks/useColorScheme';
import { getTheme } from '../../constants/themes';
import UserOptionsModal from '../../components/modals/UserOptionsModal';
import CommentModal from '../../components/modals/CommentSectionModal';
import FundingModal from '../../components/modals/FundingModal';

export default function FeedScreen() {
  const { posts, loading, refreshPosts, fundPost } = useFeedStore();
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);
  const [refreshing, setRefreshing] = useState(false);

  // User modal state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userModalVisible, setUserModalVisible] = useState(false);

  // Comment modal state
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [activeComments, setActiveComments] = useState<any[]>([]);

  // Funding modal state
  const [fundModalVisible, setFundModalVisible] = useState(false);
  const [fundPostId, setFundPostId] = useState<string | null>(null);

  useEffect(() => {
    refreshPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPosts();
    setRefreshing(false);
  };

  // Trigger funding modal (platform-level or post-level)
  const openFundModal = (postId?: string) => {
    if (postId) setFundPostId(postId);
    setFundModalVisible(true);
  };

  const closeFundModal = () => {
    setFundPostId(null);
    setFundModalVisible(false);
  };

  const handleFund = (amount: number) => {
    if (fundPostId) {
      // post-specific funding
      fundPost(fundPostId, amount);
    } else {
      // platform-level funding
      console.log('Platform-level fund:', amount);
    }
    closeFundModal();
  };

  // User modal
  const openUserModal = (user: any) => {
    setSelectedUser(user);
    setUserModalVisible(true);
  };
  const closeUserModal = () => {
    setSelectedUser(null);
    setUserModalVisible(false);
  };

  // Comment modal
  const openCommentModal = (comments: any[]) => {
    setActiveComments(comments);
    setCommentModalVisible(true);
  };
  const closeCommentModal = () => {
    setActiveComments([]);
    setCommentModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[theme.primary, theme.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>FundHub</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Plus size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fundButton}
            onPress={() => openFundModal()} // independent, no postId
          >
            <Text style={styles.fundButtonText}>Fund</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Feed Content */}
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={[styles.scrollContent]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading && posts.length === 0 ? (
          <Text style={[styles.loadingText, { color: theme.textTertiary }]}>
            Loading projects...
          </Text>
        ) : posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.text }]}>No projects yet 👀</Text>
            <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
              Pull down to refresh or add a new project.
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onFund={() => openFundModal(post.id)}
              onOpenUserModal={() => openUserModal(post.user)}
              onOpenComments={() => openCommentModal(post.commentsData || [])}
            />
          ))
        )}
      </ScrollView>

      {/* User Options Modal */}
      {selectedUser && (
        <UserOptionsModal
          visible={userModalVisible}
          onClose={closeUserModal}
          username={selectedUser.username}
          postsCount={selectedUser.postsCount || 0}
          followersCount={selectedUser.followersCount || 0}
        />
      )}

      {/* Comment Modal */}
      {commentModalVisible && (
        <CommentModal
          visible={commentModalVisible}
          onClose={closeCommentModal}
          comments={activeComments}
          onAddComment={(text) => {
            const newComment = {
              id: Math.random().toString(),
              username: 'You',
              text,
              liked: false,
              replies: [],
            };
            setActiveComments([newComment, ...activeComments]);
          }}
        />
      )}

      {/* Funding Modal */}
      {fundModalVisible && (
        <FundingModal
          visible={fundModalVisible}
          onClose={closeFundModal}
          onFund={handleFund}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 16 },
  fundButton: {
    marginLeft: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF20',
  },
  fundButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 40 },
  loadingText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 24 },
  emptyText: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  emptySubtext: { fontSize: 14, textAlign: 'center' },
});
