import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { Search } from "lucide-react-native";
import { useFeedStore } from "../../store/useFeedStore";
import { useColorScheme } from "../../hooks/useColorScheme";
import { getTheme } from "../../constants/themes";
import FundingModal from "../../components/modals/FundingModal";
import ProgressBar from "../../components/ProgressBar";

// Mock data
import { featuredProjects } from "../../mock/projects";
import { stockImages } from "../../mock/stockImages"; // Array of { id, uri }

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const STOCK_IMAGE_SIZE = width / 4 - 12; // 4 images per row with padding

const categories = ["For You", "Trending", "Projects", "People", "Near You"];

export default function ExploreScreen() {
  const { posts, loading, refreshPosts, fundPost } = useFeedStore();
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  const [activeTab, setActiveTab] = useState("For You");
  const [fundModalVisible, setFundModalVisible] = useState(false);
  const [fundPostId, setFundPostId] = useState<string | null>(null);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const openFundModal = useCallback((postId: string) => {
    setFundPostId(postId);
    setFundModalVisible(true);
  }, []);

  const closeFundModal = useCallback(() => {
    setFundPostId(null);
    setFundModalVisible(false);
  }, []);

  const handleFund = useCallback((amount: number) => {
    if (fundPostId) {
      fundPost(fundPostId, amount);
      closeFundModal();
    }
  }, [fundPostId, fundPost, closeFundModal]);

  // 🔹 Stock images vertical scroll (4 per row)
  const renderStockImage = useCallback(({ item }: { item: any }) => (
    <View style={[styles.stockImageCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.uri }} style={styles.stockImage} />
    </View>
  ), [theme]);

  // 🔹 Ongoing campaigns horizontal with snap
  const renderCampaign = useCallback(({ item }: { item: any }) => (
    <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.image }} style={styles.featureImage} />
      <Text style={[styles.featureTitle, { color: theme.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <ProgressBar current={item.funded} target={item.goal} showAmount={false} />
      <TouchableOpacity
        style={[styles.fundButton, { backgroundColor: theme.primary }]}
        onPress={() => openFundModal(item.id)}
      >
        <Text style={styles.fundButtonText}>Fund</Text>
      </TouchableOpacity>
    </View>
  ), [theme, openFundModal]);

  const ListHeader = useCallback(() => (
    <>
      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Search size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search people, posts, or projects..."
          placeholderTextColor={theme.textTertiary}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      {/* Category Tabs */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(cat) => cat}
        contentContainerStyle={styles.tabs}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, activeTab === item && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(item)}
          >
            <Text style={[styles.tabText, { color: activeTab === item ? theme.primary : theme.textSecondary }]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Stock images grid - vertical scroll */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Images</Text>
      <FlatList
        data={stockImages}
        renderItem={renderStockImage}
        keyExtractor={(item) => item.id}
        numColumns={4}
        scrollEnabled={false} // let main FlatList scroll
        contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 16 }}
      />

      {/* Ongoing campaigns horizontal with snap */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Ongoing Campaigns</Text>
      <FlatList
        data={featuredProjects}
        renderItem={renderCampaign}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16} // snap width + margin
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />

      <Text style={[styles.sectionTitle, { color: theme.text }]}>More Projects</Text>
    </>
  ), [theme, activeTab, renderStockImage, renderCampaign]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={loading && posts.length === 0 ? [] : posts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
            {loading ? "Loading explore..." : "Nothing to explore yet 🚀"}
          </Text>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.gridItem,
              { backgroundColor: theme.card, borderColor: theme.border },
              index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 },
            ]}
            onPress={() => openFundModal(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.gridImage} />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />

      <FundingModal
        visible={fundModalVisible}
        onClose={closeFundModal}
        onFund={handleFund}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  tabs: { paddingHorizontal: 12, paddingBottom: 8 },
  tab: { marginRight: 20, paddingVertical: 6 },
  tabText: { fontSize: 15, fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginLeft: 12, marginTop: 12, marginBottom: 8 },
  stockImageCard: { width: STOCK_IMAGE_SIZE, height: STOCK_IMAGE_SIZE, borderRadius: 8, borderWidth: 1, margin: 3, overflow: "hidden" },
  stockImage: { width: "100%", height: "100%", resizeMode: "cover" },
  featureCard: { width: CARD_WIDTH, marginRight: 16, borderWidth: 1, borderRadius: 16, padding: 12 },
  featureImage: { width: "100%", height: 140, borderRadius: 12, marginBottom: 8 },
  featureTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  fundButton: { marginTop: 10, paddingVertical: 6, borderRadius: 8, alignItems: "center" },
  fundButtonText: { color: "#fff", fontWeight: "600" },
  gridItem: { flexBasis: "47%", marginBottom: 12, borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  gridImage: { width: "100%", height: 160, resizeMode: "cover" },
  overlay: { position: "absolute", bottom: 6, right: 6, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  overlayText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 16 },
});
