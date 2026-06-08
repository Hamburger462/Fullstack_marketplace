import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { type Product } from "../../entities/product/model/types";

import styles from "./ProductGrid.module.css";

type SortOption = "price_asc" | "price_desc" | "rating" | "newest";

const SORT_LABELS: Record<SortOption, string> = {
    price_asc: "Price: low to high",
    price_desc: "Price: high to low",
    rating: "Top rated",
    newest: "Newest",
};

function sortProducts(products: Product[], sort: SortOption): Product[] {
    const copy = [...products];
    switch (sort) {
        case "price_asc":  return copy.sort((a, b) => a.price - b.price);
        case "price_desc": return copy.sort((a, b) => b.price - a.price);
        case "rating":     return copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        case "newest":     return copy.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
        default:           return copy;
    }
}

const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(n);

export default function ProductGrid({ products }: { products: Product[] }) {
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState<string>("All");
    const [sort, setSort] = useState<SortOption>("price_asc");

    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

    const filtered =
        activeCategory === "All"
            ? products
            : products.filter((p) => p.category === activeCategory);

    const sorted = sortProducts(filtered, sort);

    return (
        <div>
            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <span className={styles.count}>{sorted.length} products</span>

                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`${styles.filterPill} ${activeCategory === cat ? styles.filterPillActive : ""}`}
                            onClick={() => setActiveCategory(cat as string)}
                        >
                            {cat === "All" && (
                                <i className="ti ti-adjustments-horizontal" style={{ fontSize: 13 }} aria-hidden="true" />
                            )}
                            {cat}
                        </button>
                    ))}
                </div>

                <select
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    aria-label="Sort products"
                >
                    {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {/* ── Grid ── */}
            <div className={styles.grid}>
                {sorted.length === 0 ? (
                    <div className={styles.empty}>
                        <i className={`ti ti-inbox ${styles.emptyIcon}`} aria-hidden="true" />
                        No products found
                    </div>
                ) : (
                    sorted.map((product) => (
                        <div
                            key={product.id}
                            className={styles.card}
                            onClick={() => navigate(`/item/${product.id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && navigate(`/item/${product.id}`)}
                            aria-label={`View ${product.title}`}
                        >
                            {/* Image */}
                            <div className={styles.cardImg}>
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.title}
                                        className={styles.cardImage}
                                    />
                                ) : (
                                    <i className="ti ti-photo" aria-hidden="true" />
                                )}
                                {product.is_new && (
                                    <span className={`${styles.cardBadge} ${styles.badgeNew}`}>New</span>
                                )}
                                {product.old_price && (
                                    <span className={`${styles.cardBadge} ${styles.badgeSale}`}>Sale</span>
                                )}
                            </div>

                            {/* Body */}
                            <div className={styles.cardBody}>
                                {product.category && (
                                    <p className={styles.cardCategory}>{product.category}</p>
                                )}
                                <h2 className={styles.cardTitle}>{product.title}</h2>

                                <div className={styles.cardFooter}>
                                    <div className={styles.priceWrap}>
                                        <span className={styles.price}>{formatPrice(product.price)}</span>
                                        {product.old_price && (
                                            <span className={styles.priceOld}>{formatPrice(product.old_price)}</span>
                                        )}
                                    </div>
                                    <button
                                        className={styles.btnMore}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/item/${product.id}`);
                                        }}
                                    >
                                        <i className="ti ti-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
                                        See more
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}