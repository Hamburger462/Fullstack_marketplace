import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom"; // Imported to handle search queries

import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

import { getAllProducts } from "../../features/product/productAPI";
import { getAllRubrics } from "../../features/rubrics/rubricsAPI";

import { type Product } from "../../entities/product/model/types";
import { type Rubric } from "../../entities/rubric/model/types";

import ProductCard from "../../widgets/ProductCard/ProductCard";
import ProductModalWindow from "../../widgets/ProductModalWindow/ProductModalWindow";

import styles from "./SellerDashboardPage.module.css";

const SKELETON_COUNT = 3;

function DashboardSkeleton() {
    return (
        <div className={styles.skelGrid}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className={styles.skelCard}>
                    <div className={`${styles.skel} ${styles.skelImg}`} />
                    <div className={styles.skelBody}>
                        <div className={`${styles.skel} ${styles.skelTitle}`} />
                        <div className={`${styles.skel} ${styles.skelDescFull}`} />
                        <div className={`${styles.skel} ${styles.skelDescShort}`} />
                        <div className={styles.skelFooter}>
                            <div className={`${styles.skel} ${styles.skelPrice}`} />
                        </div>
                    </div>
                    <div className={styles.skelActions}>
                        <div className={`${styles.skel} ${styles.skelBtn}`} />
                        <div className={`${styles.skel} ${styles.skelBtn}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
    return (
        <div className={styles.empty}>
            <i className={`ti ti-package-off ${styles.emptyIcon}`} aria-hidden="true" />
            <p className={styles.emptyTitle}>No listings yet</p>
            <p className={styles.emptyDesc}>
                Create your first product and start selling today.
            </p>
            <button className={styles.btnCreate} onClick={onCreateClick}>
                <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" />
                Create product
            </button>
        </div>
    );
}

const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(n);

export default function SellerDashboardPage() {
    const { user } = useAuthContext();
    const [searchParams, setSearchParams] = useSearchParams(); // Destructure hooks to parse standard queries
    
    const [userProducts, setUserProducts] = useState<Product[]>([]);
    const [allRubrics, setAllRubrics] = useState<Rubric[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = useState<Product | undefined>();

    useEffect(() => {
        const loadData = async () => {
            const [productsData, rubricsData] = await Promise.all([
                getAllProducts(),
                getAllRubrics(),
            ]);

            let filteredProducts: Product[] = [];

            if (productsData) {
                filteredProducts = productsData.filter((p) => p.seller_id === user?.id);
                setUserProducts(filteredProducts);
            }

            if (rubricsData) {
                setAllRubrics(rubricsData.items);
            }

            // Check if the URL contains an `item` query parameter (?item=XYZ)
            const itemIdParam = searchParams.get("item");
            if (itemIdParam && filteredProducts.length > 0) {
                const matchedProduct = filteredProducts.find((p) => p.id === itemIdParam);
                if (matchedProduct) {
                    setCurrentProduct(matchedProduct);
                    setModalOpen(true);
                }
            }

            setLoading(false);
        };

        loadData();
    }, [user, isModalOpen, searchParams]); // Run when search params mutation vectors adjust

    const handleCloseModal = (isOpen: boolean) => {
        setModalOpen(isOpen);
        // Clean up the URL search query string parameters when the modal closes
        if (!isOpen && searchParams.has("item")) {
            searchParams.delete("item");
            setSearchParams(searchParams);
        }
    };

    const activeCount = userProducts.filter((p) => p.status === "active").length;
    const draftCount  = userProducts.filter((p) => p.status === "draft").length;
    const totalValue  = userProducts.reduce((sum, p) => sum + p.price, 0);

    return (
        <>
            <div className={styles.page}>

                {/* ── Header ── */}
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Seller dashboard</h1>
                        <p className={styles.pageSub}>Manage your listed products</p>
                    </div>
                    <button
                        className={styles.btnCreate}
                        onClick={() => {
                            setCurrentProduct(undefined);
                            setModalOpen(true);
                        }}
                    >
                        <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" />
                        Create product
                    </button>
                </div>

                {loading ? (
                    <DashboardSkeleton />
                ) : (
                    <>
                        {/* ── Stats ── */}
                        {userProducts.length > 0 && (
                            <div className={styles.statsRow}>
                                <div className={styles.statCard}>
                                    <div className={styles.statNum}>{userProducts.length}</div>
                                    <div className={styles.statLabel}>Total listings</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statNum}>{activeCount}</div>
                                    <div className={styles.statLabel}>Active</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statNum}>{draftCount}</div>
                                    <div className={styles.statLabel}>Drafts</div>
                                </div>
                                <div className={styles.statCard}>
                                    {/* <div className={styles.formatPrice(totalValue)}>{formatPrice(totalValue)}</div> */}
                                    <div className={styles.statLabel}>Total value listed</div>
                                </div>
                            </div>
                        )}

                        {/* ── Grid ── */}
                        {userProducts.length === 0 ? (
                            <EmptyState onCreateClick={() => setModalOpen(true)} />
                        ) : (
                            <>
                                <p className={styles.sectionTitle}>Your listings</p>
                                <div className={styles.grid}>
                                    {userProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* ── Modal portal ── */}
            {isModalOpen &&
                createPortal(
                    <ProductModalWindow
                        product={currentProduct}
                        rubrics={allRubrics}
                        setModalOpen={handleCloseModal} // Uses modified handler to wipe parameters cleanly on backdrop exit
                    />,
                    document.body,
                )}
        </>
    );
}