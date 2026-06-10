import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getProductById } from "../../features/product/productAPI";
import { deleteProduct } from "../../features/product/productAPI";
import { type Product } from "../../entities/product/model/types";
import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

import styles from "./ProductDetailsPage.module.css";

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

function PageSkeleton() {
    return (
        <div className={styles.skelLayout}>
            {/* Gallery side */}
            <div>
                <div className={`${styles.skel} ${styles.skelMainImg}`} />
                <div className={styles.skelThumbs}>
                    {[0, 1, 2].map((i) => (
                        <div key={i} className={`${styles.skel} ${styles.skelThumb}`} />
                    ))}
                </div>
            </div>

            {/* Info side */}
            <div>
                <div className={`${styles.skel} ${styles.skelBadge}`} />
                <div className={`${styles.skel} ${styles.skelTitle}`} />
                <div className={`${styles.skel} ${styles.skelPrice}`} />
                <div className={styles.skelDivider} />
                <div className={`${styles.skel} ${styles.skelDescTitle}`} />
                <div className={`${styles.skel} ${styles.skelDescLine} ${styles.skelDescFull}`} />
                <div className={`${styles.skel} ${styles.skelDescLine} ${styles.skelDescFull}`} />
                <div className={`${styles.skel} ${styles.skelDescLine} ${styles.skelDescShort}`} />
                <div className={`${styles.skel} ${styles.skelBtn}`} />
            </div>
        </div>
    );
}

function NotFound() {
    return (
        <div className={styles.notFound}>
            <i className={`ti ti-mood-sad ${styles.notFoundIcon}`} aria-hidden="true" />
            <h2 className={styles.notFoundTitle}>Product not found</h2>
            <p className={styles.notFoundDesc}>
                This listing may have been removed or the link is incorrect.
            </p>
            <Link to="/items" className={styles.btnBack}>
                <i className="ti ti-arrow-left" style={{ fontSize: 13 }} aria-hidden="true" />
                Back to catalogue
            </Link>
        </div>
    );
}

export default function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const [product, setProduct] = useState<Product | null>(null);
    const [activeImg, setActiveImg] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await getProductById(id as string);
                setProduct(response);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        loadProduct();
    }, [id]);

    const handleDelete = async () => {
        if (!product) return;
        if (confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(product.id);
            navigate("/items");
        }
    };

    const isOwner =
        user && product &&
        (product.seller_id === user.id || user.user_type === "admin");

    const statusKey   = product?.status?.toLowerCase();
    const statusClass = statusKey ? STATUS_STYLES[statusKey] : undefined;
    const statusLabel = statusKey ? STATUS_LABELS[statusKey] : undefined;

    const images = product?.images ?? [];

    return (
        <div className={styles.page}>

            {/* ── Breadcrumb ── */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link to="/" className={styles.breadcrumbLink}>Home</Link>
                <span className={styles.breadcrumbSep}>›</span>
                <Link to="/items" className={styles.breadcrumbLink}>Catalogue</Link>
                {product && (
                    <>
                        <span className={styles.breadcrumbSep}>›</span>
                        <span>{product.title}</span>
                    </>
                )}
            </nav>

            {/* ── States ── */}
            {loading ? (
                <PageSkeleton />
            ) : !product ? (
                <NotFound />
            ) : (
                <div className={styles.layout}>

                    {/* ── Gallery ── */}
                    <div>
                        <div className={styles.mainImg}>
                            {images.length > 0 ? (
                                <img
                                    src={images[activeImg]}
                                    alt={product.title}
                                    className={styles.mainImgPhoto}
                                />
                            ) : (
                                <i
                                    className={`ti ti-photo-off ${styles.noImgIcon}`}
                                    aria-hidden="true"
                                />
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className={styles.thumbs}>
                                {images.map((src, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ""}`}
                                        onClick={() => setActiveImg(i)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === "Enter" && setActiveImg(i)}
                                        aria-label={`Image ${i + 1}`}
                                    >
                                        <img
                                            src={src}
                                            alt={`${product.title} ${i + 1}`}
                                            className={styles.thumbImg}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Info ── */}
                    <div>
                        {statusClass && statusLabel && (
                            <span className={`${styles.statusBadge} ${statusClass}`}>
                                {statusLabel}
                            </span>
                        )}

                        <h1 className={styles.productTitle}>{product.title}</h1>
                        <div className={styles.productPrice}>{formatPrice(product.price)}</div>

                        {product.description && (
                            <>
                                <div className={styles.divider} />
                                <p className={styles.descTitle}>Description</p>
                                <p className={styles.descText}>{product.description}</p>
                            </>
                        )}

                        <div className={styles.divider} />

                        {/* Seller row */}
                        <div className={styles.sellerRow}>
                            <div className={styles.sellerAvatar}>
                                <i className="ti ti-user" style={{ fontSize: 15 }} aria-hidden="true" />
                            </div>
                            <div>
                                <div className={styles.sellerName}>Seller</div>
                                <div className={styles.sellerLabel}>Listed this product</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.actions}>
                            <button className={styles.btnCart}>
                                <i className="ti ti-shopping-cart" style={{ fontSize: 15 }} aria-hidden="true" />
                                Add to cart
                            </button>

                            {isOwner && (
                                <div className={styles.ownerActions}>
                                    <button
                                        className={styles.btnEdit}
                                        onClick={() => navigate(`/seller/dashboard?item=${product.id}`)}
                                    >
                                        <i className="ti ti-edit" style={{ fontSize: 13 }} aria-hidden="true" />
                                        Edit
                                    </button>
                                    <button className={styles.btnDelete} onClick={handleDelete}>
                                        <i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}