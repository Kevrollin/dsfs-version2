import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  Share,
} from 'react-native';
import { User, Share2, AlertCircle } from 'lucide-react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { getTheme } from '../../constants/themes';

const { height: screenHeight } = Dimensions.get('window');

interface UserOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  username: string;
  postsCount: number;
  followersCount: number;
  isFollowed?: boolean;
}

export default function UserOptionsModal({
  visible,
  onClose,
  username,
  postsCount,
  followersCount,
  isFollowed = false,
}: UserOptionsModalProps) {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [followed, setFollowed] = useState(isFollowed);

  // Action functions
  const toggleFollow = () => {
    setFollowed(!followed);
    Alert.alert(
      followed ? 'Unfollowed' : 'Followed',
      `${followed ? 'You unfollowed' : 'You followed'} @${username}`
    );
  };

  const shareProfile = async () => {
    try {
      await Share.share({ message: `Check out @${username}'s profile!` });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const reportUser = () => {
    Alert.alert('Report User', `Report @${username}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Report',
        style: 'destructive',
        onPress: () => Alert.alert('Reported', `You reported @${username}`),
      },
    ]);
  };

  // Options array (after functions defined)
  const options = [
    {
      label: followed ? `Unfollow @${username}` : `Follow @${username}`,
      icon: User,
      action: toggleFollow,
      color: theme.text,
    },
    { label: 'Share Profile', icon: Share2, action: shareProfile, color: theme.text },
    { label: 'Report User', icon: AlertCircle, action: reportUser, color: theme.error },
  ];

  // Anim refs for options
  const optionAnim = useRef(options.map(() => new Animated.Value(0))).current;

  // Animate modal & options
  useEffect(() => {
    if (visible) {
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
        Animated.stagger(
          100,
          optionAnim.map((anim) =>
            Animated.timing(anim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            })
          )
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.stagger(
          50,
          optionAnim
            .map((anim) =>
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
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backgroundOverlay, { opacity: overlayAnim, backgroundColor: theme.overlay }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }], backgroundColor: theme.modal }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.username, { color: theme.text }]}>@{username}</Text>
            <Text style={[styles.details, { color: theme.textSecondary }]}>
              {postsCount} Posts • {followersCount} Followers
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Animated Options */}
        {options.map((opt, idx) => {
          const Icon = opt.icon;
          return (
            <Animated.View
              key={idx}
              style={{
                opacity: optionAnim[idx],
                transform: [
                  {
                    translateY: optionAnim[idx].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity style={styles.optionButton} onPress={opt.action}>
                <Icon size={20} color={opt.color} style={styles.optionIcon} />
                <Text style={[styles.optionText, { color: opt.color }]}>{opt.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  username: { fontSize: 18, fontWeight: '700' },
  details: { fontSize: 14, marginTop: 4 },
  closeButton: { padding: 8 },
  closeText: { fontSize: 20, fontWeight: '700' },
  optionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  optionIcon: { marginRight: 12 },
  optionText: { fontSize: 16, fontWeight: '500' },
});
