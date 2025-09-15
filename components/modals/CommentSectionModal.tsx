import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Heart, MessageCircle, X } from 'lucide-react-native';
import { colors } from '../../constants/colors';

const { height: screenHeight } = Dimensions.get('window');

interface Comment {
  id: string;
  username: string;
  text: string;
  liked: boolean;
  replies?: Comment[];
}

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string, replyToId?: string) => void;
  onOpenUserProfile: (username: string) => void;
}

export default function CommentModal({
  visible,
  onClose,
  comments,
  onAddComment,
  onOpenUserProfile,
}: CommentModalProps) {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  // Animated values for staggered comments
  const commentAnimRefs = useRef(comments.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (visible) {
      // Slide up modal & fade overlay
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Staggered animation for each comment
        Animated.stagger(
          50,
          commentAnimRefs.map(anim =>
            Animated.timing(anim, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            })
          )
        ),
      ]).start();
    } else {
      // Slide down modal & hide overlay
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.stagger(
          30,
          commentAnimRefs
            .map(anim =>
              Animated.timing(anim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              })
            )
            .reverse()
        ),
      ]).start();
    }
  }, [visible, comments]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText.trim(), replyToId || undefined);
    setCommentText('');
    setReplyToId(null);
  };

  const renderReplies = (replies: Comment[]) =>
    replies.map(reply => (
      <View key={reply.id} style={styles.replyContainer}>
        <TouchableOpacity onPress={() => onOpenUserProfile(reply.username)}>
          <Text style={styles.replyUsername}>@{reply.username}</Text>
        </TouchableOpacity>
        <Text style={styles.replyText}>{reply.text}</Text>
        <TouchableOpacity style={styles.replyButton} onPress={() => setReplyToId(reply.id)}>
          <Text style={styles.replyBtnText}>Reply</Text>
        </TouchableOpacity>
        {reply.replies && reply.replies.length > 0 && (
          <View style={{ marginLeft: 16 }}>{renderReplies(reply.replies)}</View>
        )}
      </View>
    ));

  const renderComment = ({ item, index }: { item: Comment; index: number }) => {
    const anim = commentAnimRefs[index] || new Animated.Value(1);
    return (
      <Animated.View
        style={{
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
            },
          ],
        }}
      >
        <View style={styles.commentContainer}>
          <View style={styles.commentHeader}>
            <TouchableOpacity onPress={() => onOpenUserProfile(item.username)}>
              <Text style={styles.commentUsername}>@{item.username}</Text>
            </TouchableOpacity>
            <View style={styles.commentActions}>
              <TouchableOpacity>
                <Heart size={16} color={item.liked ? colors.error : colors.gray[500]} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginLeft: 12 }}
                onPress={() => setReplyToId(item.id)}
              >
                <MessageCircle size={16} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.commentText}>{item.text}</Text>
          {item.replies && item.replies.length > 0 && (
            <View style={{ marginTop: 8, marginLeft: 16 }}>{renderReplies(item.replies)}</View>
          )}
        </View>
      </Animated.View>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backgroundOverlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{replyToId ? 'Replying...' : 'Comments'}</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={22} color={colors.gray[700]} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            renderItem={renderComment}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.addCommentContainer}>
            <TextInput
              autoFocus
              value={commentText}
              onChangeText={setCommentText}
              placeholder={replyToId ? 'Write a reply...' : 'Add a comment...'}
              style={styles.input}
            />
            <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
              <Text style={{ color: colors.white, fontWeight: '700' }}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  backgroundOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: colors.dark },
  commentContainer: { marginBottom: 12 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentUsername: { fontWeight: '700', color: colors.primary },
  commentActions: { flexDirection: 'row' },
  commentText: { marginTop: 4, color: colors.dark },
  replyContainer: { marginTop: 6 },
  replyUsername: { fontWeight: '600', color: colors.primary },
  replyText: { color: colors.gray[700] },
  replyButton: { marginTop: 2 },
  replyBtnText: { color: colors.gray[500], fontSize: 12 },
  addCommentContainer: { flexDirection: 'row', marginTop: 12, alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: { backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 24 },
});
