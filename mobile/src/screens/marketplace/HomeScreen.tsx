import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import ScreenContainer from "@/components/ScreenContainer";

const { width } = Dimensions.get("window");

// Mock categories for the horizontal selector axis
const CATEGORIES = [
  { id: "1", name: "All", icon: "✨" },
  { id: "2", name: "Audio", icon: "🎧" },
  { id: "3", name: "Plants", icon: "🪴" },
  { id: "4", name: "Lighting", icon: "🪔" },
  { id: "5", name: "Gear", icon: "🎒" },
];

// Mock featured assets aligned with your design system data structures
const FEATURED_DEALS = [
  {
    id: "f1",
    title: "Studio Pro headphones",
    tagline: "Experience pristine studio acoustics anywhere.",
    price: 129,
    bg: "#EEEDFE",
    icon: "🎧",
  },
  {
    id: "f2",
    title: "Linen table lamp",
    tagline: "Warm accent illumination for minimalists.",
    price: 89,
    bg: "#FAEEDA",
    icon: "🪔",
  },
];

export default function HomeScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("1");

  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* ─── HEADER WELCOME PROFILE BLOCK ─── */}
        <View style={styles.headerBlock}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.profileName}>Discover Items</Text>
          </View>
          <TouchableOpacity 
            style={styles.cartBadgeBtn}
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.cartIconText}>🛒</Text>
          </TouchableOpacity>
        </View>

        {/* ─── SEARCH & FILTER ELEMENT BAR ─── */}
        <View style={styles.searchBarWrapper}>
          <Text style={styles.searchInlineIcon}>🔍</Text>
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search products, brands, categories..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* ─── HORIZONTAL RUBRIC/CATEGORY AXIS ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ─── FEATURED DEALS CAROUSEL ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Product")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          snapToInterval={width - 56}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
        >
          {FEATURED_DEALS.map((deal) => (
            <TouchableOpacity 
              key={deal.id} 
              style={[styles.promoCard, { backgroundColor: deal.bg }]}
              onPress={() => navigation.navigate("Product")}
            >
              <View style={styles.promoTextColumn}>
                <Text style={styles.promoBadge}>LIMITED RUN</Text>
                <Text style={styles.promoTitle} numberOfLines={2}>{deal.title}</Text>
                <Text style={styles.promoTagline} numberOfLines={2}>{deal.tagline}</Text>
                <Text style={styles.promoPrice}>From ${deal.price}</Text>
              </View>
              <Text style={styles.promoGraphicIcon}>{deal.icon}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ─── MARKETPLACE DISCOVERY FEED ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
        </View>

        <View style={styles.trendingGrid}>
          {/* Mock Grid Items displaying application patterns */}
          <View style={styles.gridProductCard}>
            <View style={[styles.gridImagePlaceholder, { backgroundColor: "#E1F5EE" }]}>
              <Text style={styles.gridIconGraphic}>静态🪴</Text>
            </View>
            <Text style={styles.gridItemTitle} numberOfLines={1}>Ceramic Planter Set</Text>
            <Text style={styles.gridItemPrice}>$44.00</Text>
          </View>

          <View style={styles.gridProductCard}>
            <View style={[styles.gridImagePlaceholder, { backgroundColor: "#FAECE7" }]}>
              <Text style={styles.gridIconGraphic}>🎒</Text>
            </View>
            <Text style={styles.gridItemTitle} numberOfLines={1}>Trail Daypack 22L</Text>
            <Text style={styles.gridItemPrice}>$74.00</Text>
          </View>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  /* ── Header ── */
  headerBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  profileName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  cartBadgeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cartIconText: {
    fontSize: 18,
  },
  /* ── Search Bar ── */
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 28,
  },
  searchInlineIcon: {
    fontSize: 16,
    marginRight: 10,
    color: "#9CA3AF",
  },
  searchBarInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  /* ── Global Section Formats ── */
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#534AB7", // Matches Primary Web Identity
  },
  /* ── Categories Axis ── */
  categoryScroll: {
    paddingLeft: 24,
    paddingRight: 12,
    marginBottom: 28,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: "#534AB7",
    borderColor: "#534AB7",
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  /* ── Promo Banner Grid ── */
  featuredScroll: {
    paddingLeft: 24,
    paddingRight: 12,
    marginBottom: 32,
  },
  promoCard: {
    width: width - 68,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  promoTextColumn: {
    flex: 1,
    paddingRight: 8,
  },
  promoBadge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#534AB7",
    letterSpacing: 1,
    marginBottom: 6,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  promoTagline: {
    fontSize: 12,
    color: "#666666",
    lineHeight: 16,
    marginBottom: 12,
  },
  promoPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#534AB7",
  },
  promoGraphicIcon: {
    fontSize: 64,
    opacity: 0.9,
  },
  /* ── Marketplace Recommendations Feed Grid ── */
  trendingGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    flexWrap: "wrap",
  },
  gridProductCard: {
    width: (width - 64) / 2,
    marginBottom: 20,
  },
  gridImagePlaceholder: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  gridIconGraphic: {
    fontSize: 44,
  },
  gridItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  gridItemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
});