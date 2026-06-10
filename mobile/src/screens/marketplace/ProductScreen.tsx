import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { itemApi } from "@/api/productAPI"; 
import { cartApi } from "@/api/cartAPI"; // Ensure this references your RN cartAPI module

import AppButton from "@/components/AppButton";
import ScreenContainer from "@/components/ScreenContainer";
import { type Item } from "@/types/product.types";

export default function ProductScreen({ navigation }: any) {
  const [items, setItems] = useState<Item[] | undefined>();
  const [loading, setLoading] = useState(true);
  
  // Local state directory containing mapped product quantities by product.id keys { [itemId]: quantity }
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  // Individual localized item loading vectors
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  async function loadCatalogueAndCart() {
    try {
      setLoading(true);
      const response = await itemApi.getAllProducts();
      setItems(response);

      // Initialize all product selection counters to a starting baseline of 1 unit
      if (response && Array.isArray(response)) {
        const initialQuantities: Record<string, number> = {};
        response.forEach((item: Item) => {
          initialQuantities[item.id] = 1;
        });
        setQuantities(initialQuantities);
      }
    } catch (error: any) {
      console.log("CATALOGUE ERROR:", error?.response?.data || error.message);
      Alert.alert("Error", "Could not load catalogue. Please check authorization states.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalogueAndCart();
  }, []);

  // Handler to adjust specific product line parameters up or down safely
  const handleQuantityUpdate = (itemId: string, increment: number) => {
    setQuantities((prev) => {
      const currentQty = prev[itemId] || 1;
      const nextQty = currentQty + increment;
      return {
        ...prev,
        [itemId]: nextQty < 1 ? 1 : nextQty, // Prevents descending lower than 1 unit
      };
    });
  };

  const handleAddToCart = async (item: Item) => {
    const selectedQuantity = quantities[item.id] || 1;
    setAddingItemId(item.id);
    
    try {
      // 1. Download active server state cart payload array
      const currentCartItems = await cartApi.getUserCart();
      
      // 2. Scan array to establish if row parameter reference mapping is active
      const existingCartItem = Array.isArray(currentCartItems)
        ? currentCartItems.find((cartEntry: any) => cartEntry.item_id === item.id)
        : null;

      if (existingCartItem) {
        // 3. Increment structural configuration payload fields (Current standard + new configuration)
        await cartApi.updateCartProduct(existingCartItem.id, {
          item_id: item.id,
          quantity: existingCartItem.quantity + selectedQuantity,
        });
      } else {
        // 4. Append new entry line
        await cartApi.addProductToCart({
          item_id: item.id,
          quantity: selectedQuantity,
        });
      }
      
      Alert.alert(
        "Success 🎉", 
        `${selectedQuantity}x "${item.title}" successfully allocated to your shopping cart.`
      );
      
      // Reset this card's selector display value back down to 1 after completion
      setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    } catch (err: any) {
      console.log("CART ACTION FAULT:", err?.response?.data || err.message);
      Alert.alert("Error", "Failed to finalize cart sync requirements.");
    } finally {
      setAddingItemId(null);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#534AB7" />
          <Text style={styles.loadingText}>Products loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Title Section Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Catalogue</Text>
            <Text style={styles.subtitle}>Find your next favorite item</Text>
          </View>
          <TouchableOpacity 
            style={styles.cartNavButton} 
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.cartNavButtonText}>🛒 View Cart</Text>
          </TouchableOpacity>
        </View>

        {items && items.length > 0 ? (
          items.map((item) => {
            const currentItemQty = quantities[item.id] || 1;

            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardBody}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDesc} numberOfLines={3}>
                    {item.desc || "No comprehensive description logs found for this catalog entry."}
                  </Text>
                  
                  <View style={styles.footerRow}>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.priceValue}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                      }).format(Number(item.price || 0))}
                    </Text>
                  </View>
                </View>

                {/* Interactive Action Row Area */}
                <View style={styles.actionsContainer}>
                  {/* Quantity Adjustment Controls Box Component */}
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={[styles.qtyBtn, currentItemQty <= 1 && styles.qtyBtnDisabled]}
                      onPress={() => handleQuantityUpdate(item.id, -1)}
                      disabled={currentItemQty <= 1}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.qtyTextValue}>{currentItemQty}</Text>
                    
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => handleQuantityUpdate(item.id, 1)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Add to Basket Action Trigger Button */}
                  <TouchableOpacity
                    style={[styles.addToCartBtn, addingItemId === item.id && styles.disabledBtn]}
                    onPress={() => handleAddToCart(item)}
                    disabled={addingItemId !== null}
                  >
                    {addingItemId === item.id ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.addToCartBtnText}>Add to Cart</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>No listings available inside this catalog index module.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "500",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  cartNavButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cartNavButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  cardBody: {
    padding: 20,
    paddingBottom: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  itemDesc: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#534AB7",
  },
  actionsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    alignItems: "center",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    height: 52,
    borderRightWidth: 1,
    borderRightColor: "#F3F4F6",
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnDisabled: {
    opacity: 0.4,
    backgroundColor: "#F3F4F6",
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  qtyTextValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    minWidth: 20,
    textAlign: "center",
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: "#534AB7",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBtn: {
    backgroundColor: "#9FA4E4",
  },
  addToCartBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  empty: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
});