import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { Heart, MessageCircle, Share, Check, MoreHorizontal } from 'lucide-react-native';
import Avatar from './Avatar';
import FundButton from './FundButton';
import FundingModal from './modals/FundingModal';
import { colors } from '../constants/colors';
import { useFeedStore } from '../store/useFeedStore';

const { width: screenWidth } = Dimensions.get('window');

interface PostCardProps {
  post: any;
  source?: 'verifiedDashboard' | 'baseFeed';
  onFund?: (amount: number) => void;
  onOpenUserModal?: () => void;
  onOpenComments?: () => void;
}

export default function PostCard({
  post,
  source = 'baseFeed',
  onFund,
  onOpenUserModal,
  onOpenComments,
}: PostCardProps) {
  const { likePost } = useFeedStore();
  const [liked, setLiked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fundModalVisible, setFundModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleLike = () => {
    setLiked((prev) => !prev);
    likePost(post.id);
  };

  const handleFund = (amount?: number) => {
    if (amount) {
      onFund?.(amount);
      setFundModalVisible(false);
    } else {
      setFundModalVisible(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View>
            <Avatar source={post.user?.avatar} size="medium" verified={post.user?.isVerified} />
            {post.user?.isStudent && (
              <View style={styles.studentTick}>
                <Check size={12} color={colors.white} />
              </View>
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.username}>{post.user?.username}</Text>
            <Text style={styles.timestamp}>{formatDate(post.timestamp)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton} onPress={onOpenUserModal}>
          <MoreHorizontal size={24} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>

      {/* Image Carousel */}
      <View style={styles.carouselWrapper}>
        <FlatList
          ref={flatListRef}
          data={post.images || [post.image]}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.postImage} />}
        />
        {post.images && post.images.length > 1 && (
          <View style={styles.pagination}>
            {(post.images || []).map((_, i) => (
              <View key={i} style={[styles.dot, i === activeIndex && { opacity: 1 }]} />
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Heart
              size={24}
              color={liked ? colors.error : colors.gray[700]}
              fill={liked ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenComments} style={styles.actionButton}>
            <MessageCircle size={24} color={colors.gray[700]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={24} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>
        {post.isFundable && <FundButton size="small" onPress={() => handleFund()} />}
      </View>

      {/* Likes */}
      <Text style={styles.likes}>{post.likes.toLocaleString()} likes</Text>

      {/* Caption */}
      <Text style={styles.caption}>
        <Text style={styles.username}>{post.user?.username}</Text> {post.caption}
      </Text>

      {/* Funding Modal */}
      {post.isFundable && (
        <FundingModal
          visible={fundModalVisible}
          onClose={() => setFundModalVisible(false)}
          onFund={handleFund}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  userDetails: { marginLeft: 12, justifyContent: 'center' },
  username: { fontSize: 16, fontWeight: '600', color: colors.dark },
  timestamp: { fontSize: 12, color: colors.gray[500], marginTop: 2 },
  studentTick: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 18,
    height: 18,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
  },
  moreButton: { marginLeft: 12 },
  carouselWrapper: { position: 'relative' },
  postImage: {
    width: screenWidth,
    height: screenWidth,
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.dark,
    marginHorizontal: 4,
    opacity: 0.3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: { flexDirection: 'row' },
  actionButton: { marginRight: 16 },
  likes: { paddingHorizontal: 16, fontSize: 14, fontWeight: '600', color: colors.dark, marginBottom: 6 },
  caption: { paddingHorizontal: 16, fontSize: 14, color: colors.dark, lineHeight: 20, marginBottom: 8 },
});
