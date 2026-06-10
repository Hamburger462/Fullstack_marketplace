import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";

import { cartApi } from "@/api/cartAPI"; // Update path if needed
import { itemApi } from "@/api/productAPI"; // Reusing your project's catalogue fetcher
import ScreenContainer from "@/components/ScreenContainer";
import { type Item } from "@/types/product.types";

const { width } = Dimensions.get("window");

interface HydratedCartItem {
  id: string;        // Cart Entry ID
  item_id: string;   // Catalog Product ID
  quantity: number;
  product: Item | null;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);

export default function CartScreen({ navigation }: any) {
  const [cartItems, setCartItems] = useState<HydratedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);

  const fetchCartContents = async () => {
    try {
      setLoading(true);
      // 1. Fetch concurrent data from raw cart arrays and central marketplace items
      const [rawCart, catalogue] = await Promise.all([
        cartApi.getUserCart(),
        itemApi.getAllProducts(),
      ]);

      if (rawCart && Array.isArray(rawCart) && catalogue) {
        // 2. Cross-reference item data keys to construct hydrated products inside items
        const hydrated = rawCart.map((cartItem: any) => {
          const matchingProduct = catalogue.find((p: Item) => p.id === cartItem.item_id);
          return {
            id: cartItem.id,
            item_id: cartItem.item_id,
            quantity: cartItem.quantity,
            product: matchingProduct || null,
          };
        });
        setCartItems(hydrated);
      } else {
        setCartItems([]);
      }
    } catch (error: any) {
      console.error("Fetch cart error:", error);
      Alert.alert("Error", "Could not synchronize shopping cart records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartContents();
  }, []);

  const handleQtyChange = async (cartId: string, itemId: string, activeQty: number, offset: number) => {
    const targetQty = activeQty + offset;
    if (targetQty < 1) return;

    // Optimistic local state rendering for rapid interface feedback
    setCartItems((prev) =>
      prev.map((item) => (item.id === cartId ? { ...item, quantity: targetQty } : item))
    );
    setUpdatingIds((prev) => [...prev, cartId]);

    try {
      await cartApi.updateCartProduct(cartId, {
        item_id: itemId,
        quantity: targetQty,
      });
    } catch (err) {
      console.error("Update cart action error:", err);
      // Fallback rollback to standard DB snapshots on failure 
      fetchCartContents();
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== cartId));
    }
  };

  const handleEjectItem = async (cartId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to drop this product from your order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setCartItems((prev) => prev.filter((item) => item.id !== cartId));
            try {
              await cartApi.deleteProductFromCart(cartId);
            } catch (err) {
              console.error("Eject cart item error:", err);
              fetchCartContents();
            }
          },
        },
      ]
    );
  };

  // Financial layout configurations 
  const subtotal = cartItems.reduce((total, current) => {
    const price = current.product ? Number(current.product.price) : 0;
    return total + price * current.quantity;
  }, 0);

  const deliveryFee = cartItems.length > 0 ? 15 : 0;
  const grandTotal = subtotal + deliveryFee;

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#534AB7" />
          <Text style={styles.infoText}>Calculating cart selections...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {cartItems.length === 0 ? (
        /* ─── EMPTY STATE LAYOUT ─── */
        <View style={styles.centerEmpty}>
          <Text style={styles.emptyGraphic}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDesc}>
            Looks like you haven't populated your order catalog list yet. Let's add some items!
          </Text>
          <TouchableOpacity
            style={styles.btnBrowse}
            onPress={() => navigation.navigate("Product")}
          >
            <Text style={styles.btnBrowseText}>Explore Catalogue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ─── ACTIVE CART MANIFEST LAYOUT ─── */
        <View style={styles.mainContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollPadding}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionHeader}>Your Order Items</Text>
            
            {cartItems.map((item) => {
              const product = item.product;
              const productPrice = product ? Number(product.price) : 0;

              return (
                <View key={item.id} style={styles.itemRowCard}>
                  {/* Avatar/Graphic block representation */}
                  <View style={styles.imgBlockMock}>
                    <Text style={styles.imgTextMock}>📦</Text>
                  </View>

                  <View style={styles.detailsBlock}>
                    <Text style={styles.itemTitleText} numberOfLines={1}>
                      {product ? product.title : "Loading item profiles..."}
                    </Text>
                    <Text style={styles.itemPriceText}>
                      {formatPrice(productPrice)}
                    </Text>
                  </View>

                  {/* Quantity and removal column modifiers */}
                  <View style={styles.controlBoxColumn}>
                    <View style={styles.qtyRowControls}>
                      <TouchableOpacity
                        style={[styles.miniQtyBtn, item.quantity <= 1 && styles.disabledMiniBtn]}
                        disabled={item.quantity <= 1 || updatingIds.includes(item.id)}
                        onPress={() => handleQtyChange(item.id, item.item_id, item.quantity, -1)}
                      >
                        <Text style={styles.miniBtnText}>-</Text>
                      </TouchableOpacity>

                      <Text style={styles.qtyDisplayValue}>{item.quantity}</Text>

                      <TouchableOpacity
                        style={styles.miniQtyBtn}
                        disabled={updatingIds.includes(item.id)}
                        onPress={() => handleQtyChange(item.id, item.item_id, item.quantity, 1)}
                      >
                        <Text style={styles.miniBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.trashBtn}
                      onPress={() => handleEjectItem(item.id)}
                    >
                      <Text style={styles.trashText}>🗑️ Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* ─── SUMMARY FIXED CARD CONSOLE ─── */}
          <View style={styles.summaryFooterCard}>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Delivery Handling</Text>
              <Text style={styles.summaryValue}>{formatPrice(deliveryFee)}</Text>
            </View>
            
            <View style={styles.dividerDivider} />

            <View style={styles.totalSummaryLine}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
            </View>

            <TouchableOpacity
              style={styles.btnCheckoutPrimary}
              onPress={() => Alert.alert("Checkout", "Proceeding to internal payment gateway channels!")}
            >
              <Text style={styles.btnCheckoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollPadding: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  /* Empty States definitions */
  centerEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyGraphic: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  btnBrowse: {
    backgroundColor: "#534AB7",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  btnBrowseText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  /* Card List Items */
  itemRowCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  imgBlockMock: {
    width: 64,
    height: 64,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  imgTextMock: {
    fontSize: 24,
  },
  detailsBlock: {
    flex: 1,
    paddingHorizontal: 14,
  },
  itemTitleText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  itemPriceText: {
    fontSize: 14,
    color: "#534AB7",
    fontWeight: "600",
  },
  controlBoxColumn: {
    alignItems: "flex-end",
    gap: 8,
  },
  qtyRowControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniQtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledMiniBtn: {
    opacity: 0.3,
    backgroundColor: "#F3F4F6",
  },
  miniBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  qtyDisplayValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    minWidth: 16,
    textAlign: "center",
  },
  trashBtn: {
    paddingVertical: 2,
  },
  trashText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
  },
  /* Summary Block Cards */
  summaryFooterCard: {
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  dividerDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalSummaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "baseline",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#534AB7",
  },
  btnCheckoutPrimary: {
    backgroundColor: "#534AB7",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCheckoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});