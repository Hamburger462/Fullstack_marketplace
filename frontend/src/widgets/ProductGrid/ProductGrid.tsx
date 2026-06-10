import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { type Product } from "../../entities/product/model/types";

import styles from "./ProductGrid.module.css";

type SortOption = "price_asc" | "price_desc";

const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(n);

const STATUS_STYLES: Record<string, string> = {
    active: styles.statusActive,
    draft:  styles.statusDraft,
    sold:   styles.statusSold,
};

const STATUS_LABELS: Record<string, string> = {
    active: "Active",
    draft:  "Draft",
    sold:   "Sold out",
};

function sortProducts(products: Product[], sort: SortOption): Product[] {
    const copy = [...products];
    return sort === "price_asc"
        ? copy.sort((a, b) => a.price - b.price)
        : copy.sort((a, b) => b.price - a.price);
}

export default function ProductGrid({ products }: { products: Product[] }) {
    const navigate = useNavigate();
    const [sort, setSort] = useState<SortOption>("price_asc");

    const sorted = sortProducts(products, sort);

    return (
        <div>
            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <span className={styles.count}>{sorted.length} products</span>

                <select
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    aria-label="Sort products"
                >
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
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
                    sorted.map((product) => {
                        const firstImage = product.images?.[0];
                        const statusKey = product.status?.toLowerCase();
                        const statusClass = statusKey ? STATUS_STYLES[statusKey] : undefined;
                        const statusLabel = statusKey ? STATUS_LABELS[statusKey] : undefined;

                        return (
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
                                    {firstImage ? (
                                        <img
                                            src={firstImage}
                                            alt={product.title}
                                            className={styles.cardImage}
                                        />
                                    ) : (
                                        <div className={styles.noImage}>
                                            <i className="ti ti-photo-off" style={{ fontSize: 28 }} aria-hidden="true" />
                                            <span className={styles.noImageLabel}>No image</span>
                                        </div>
                                    )}

                                    {statusClass && statusLabel && (
                                        <span className={`${styles.statusBadge} ${statusClass}`}>
                                            {statusLabel}
                                        </span>
                                    )}
                                </div>

                                {/* Body */}
                                <div className={styles.cardBody}>
                                    <h2 className={styles.cardTitle}>{product.title}</h2>

                                    {product.description && (
                                        <p className={styles.cardDesc}>{product.description}</p>
                                    )}

                                    <div className={styles.cardFooter}>
                                        <span className={styles.price}>{formatPrice(product.price)}</span>
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
                        );
                    })
                )}
            </div>
        </div>
    );
}