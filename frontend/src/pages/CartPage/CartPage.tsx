import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUserCart, updateProduct, deleteProductFromCart } from "../../features/cart/cartAPI";
import { getProductById } from "../../features/product/productAPI";
import { type Product } from "../../entities/product/model/types";

import styles from "./CartPage.module.css";

const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(n);

interface ExtendedCartItem {
    id: string;        // Cart Item ID
    item_id: string;   // Product ID
    quantity: number;
    product: Product | null; // Populated via productAPI
}

function CartSkeleton() {
    return (
        <div className={styles.skelLayout}>
            <div className={styles.itemsList}>
                {[1, 2, 3].map((n) => (
                    <div key={n} className={styles.skelItem}>
                        <div className={styles.skel} style={{ width: 90, height: 90, borderRadius: 10 }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
                            <div className={styles.skel} style={{ width: "45%", height: 18 }} />
                            <div className={styles.skel} style={{ width: "15%", height: 14 }} />
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.skel} style={{ height: 240, borderRadius: 16 }} />
        </div>
    );
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<ExtendedCartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [updatingIds, setUpdatingIds] = useState<string[]>([]);

    const fetchCartData = async () => {
        try {
            // 1. Fetch backend cart items array
            const rawCart: any = await getUserCart();
            
            if (rawCart && Array.isArray(rawCart)) {
                // 2. Hydrate each cart item with full details from productAPI concurrently
                const hydratedItems = await Promise.all(
                    rawCart.map(async (item: any) => {
                        try {
                            const productDetails = await getProductById(item.item_id);
                            return {
                                id: item.id,
                                item_id: item.item_id,
                                quantity: item.quantity,
                                product: productDetails,
                            };
                        } catch (err) {
                            console.error(`Error loading details for product ${item.item_id}:`, err);
                            return {
                                id: item.id,
                                item_id: item.item_id,
                                quantity: item.quantity,
                                product: null,
                            };
                        }
                    })
                );
                setCartItems(hydratedItems);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Failed to load user cart data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const handleQuantityChange = async (cartId: string, itemId: string, activeQty: number, offset: number) => {
        const targetQty = activeQty + offset;
        if (targetQty < 1) return;

        // Optimistic State Update for responsive UI transitions
        setCartItems((prev) =>
            prev.map((item) => (item.id === cartId ? { ...item, quantity: targetQty } : item))
        );
        setUpdatingIds((prev) => [...prev, cartId]);

        try {
            await updateProduct(cartId, {
                item_id: itemId,
                quantity: targetQty,
            });
        } catch (err) {
            console.error("Failed to sync quantity update:", err);
            // Roll back to database standard on network fault
            fetchCartData();
        } finally {
            setUpdatingIds((prev) => prev.filter((id) => id !== cartId));
        }
    };

    const handleRemoveItem = async (cartId: string) => {
        if (!confirm("Are you sure you want to remove this item from your cart?")) return;

        // Optimistic display ejection
        setCartItems((prev) => prev.filter((item) => item.id !== cartId));

        try {
            await deleteProductFromCart(cartId);
        } catch (err) {
            console.error("Failed to remove cart entry:", err);
            fetchCartData();
        }
    };

    // Calculate cart financial sub-totals
    const subtotal = cartItems.reduce((total, item) => {
        const itemPrice = item.product?.price ?? 0;
        return total + itemPrice * item.quantity;
    }, 0);
    
    const shipping = cartItems.length > 0 ? 15 : 0; // Flat base value delivery rate
    const totalAmount = subtotal + shipping;

    return (
        <div className={styles.page}>
            {/* ── Breadcrumb navigation matches application metrics ── */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link to="/" className={styles.breadcrumbLink}>Home</Link>
                <span className={styles.breadcrumbSep}>›</span>
                <span>Your Cart</span>
            </nav>

            <h1 className={styles.pageTitle}>Shopping Cart</h1>

            {loading ? (
                <CartSkeleton />
            ) : cartItems.length === 0 ? (
                /* ── Empty State Dashboard ── */
                <div className={styles.emptyCart}>
                    <i className={`ti ti-shopping-cart ${styles.emptyIcon}`} aria-hidden="true" />
                    <h2 className={styles.emptyTitle}>Your cart is empty</h2>
                    <p className={styles.emptyDesc}>
                        Looks like you haven't added anything to your cart yet. Head back to browse our collection!
                    </p>
                    <Link to="/items" className={styles.btnBrowse}>
                        Explore Catalogue
                    </Link>
                </div>
            ) : (
                /* ── Content View ── */
                <div className={styles.layout}>
                    {/* Items Grid column */}
                    <div className={styles.itemsList}>
                        {cartItems.map((item) => {
                            const product = item.product;
                            const images = product?.images ?? [];
                            const itemPrice = product?.price ?? 0;

                            return (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.itemImageContainer}>
                                        {images.length > 0 ? (
                                            <img
                                                src={images[0]}
                                                alt={product?.title ?? "Product Listing"}
                                                className={styles.itemImage}
                                            />
                                        ) : (
                                            <i className={`ti ti-photo-off ${styles.noImgIcon}`} aria-hidden="true" />
                                        )}
                                    </div>

                                    <div className={styles.itemDetails}>
                                        {product ? (
                                            <Link to={`/items/${product.id}`} className={styles.itemTitle}>
                                                {product.title}
                                            </Link>
                                        ) : (
                                            <span className={styles.itemTitle}>Loading product info...</span>
                                        )}
                                        <div className={styles.itemPrice}>{formatPrice(itemPrice)}</div>
                                    </div>

                                    {/* Action row controls wrapper */}
                                    <div className={styles.actionsRow}>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.btnQty}
                                                onClick={() => handleQuantityChange(item.id, item.item_id, item.quantity, -1)}
                                                disabled={item.quantity <= 1 || updatingIds.includes(item.id)}
                                                aria-label="Decrease quantity"
                                            >
                                                -
                                            </button>
                                            <span className={styles.quantityValue}>{item.quantity}</span>
                                            <button
                                                className={styles.btnQty}
                                                onClick={() => handleQuantityChange(item.id, item.item_id, item.quantity, 1)}
                                                disabled={updatingIds.includes(item.id)}
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => handleRemoveItem(item.id)}
                                            aria-label="Remove item"
                                        >
                                            <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Financial Sidebar Summary Card */}
                    <div className={styles.summaryCard}>
                        <h2 className={styles.summaryTitle}>Order Summary</h2>
                        
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Estimated Shipping</span>
                            <span>{formatPrice(shipping)}</span>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span>{formatPrice(totalAmount)}</span>
                        </div>

                        <button 
                            className={styles.btnCheckout}
                            onClick={() => alert("Proceeding to checkout feature structure layout configuration!")}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}