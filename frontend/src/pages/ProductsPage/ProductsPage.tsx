import { useEffect, useState } from "react";

import { getAllProducts } from "../../features/product/productAPI";
import ProductGrid from "../../widgets/ProductGrid/ProductGrid";
import type { Product } from "../../entities/product/model/types";

import styles from "./ProductsPage.module.css";

const SKELETON_COUNT = 6;

function ProductsSkeleton() {
    return (
        <>
            <div className={styles.skelToolbar}>
                <div className={`${styles.skel} ${styles.skelText}`} />
                <div className={`${styles.skel} ${styles.skelSelect}`} />
            </div>

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
                                <div className={`${styles.skel} ${styles.skelBtn}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default function ProductsPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadProduct = async () => {
            const data = await getAllProducts();
            setAllProducts(data as Product[]);
            setLoading(false);
        };
        loadProduct();
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Catalogue</h1>
                <p className={styles.pageSub}>Browse all available products from our sellers</p>
            </div>

            {loading ? <ProductsSkeleton /> : <ProductGrid products={allProducts} />}
        </div>
    );
}