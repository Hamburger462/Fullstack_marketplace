import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";
import { getAllProducts } from "../../features/product/productApi";

import { type Product } from "../../entities/product/model/types";

import ProductGrid from "../../widgets/ProductGrid/ProductGrid";
import ProductModalWindow from "../../widgets/ProductModalWindow/ProductModalWindow";

export default function SellerDashboardPage() {
    const { user } = useAuthContext();
    const [userProducts, setUserProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [currentProduct, setCurrentProduct] = useState<Product | undefined>();

    useEffect(() => {
        const loadProduct = async () => {
            const data = await getAllProducts();
            if (!data) return;
            setUserProducts(
                data.filter((product) => product.seller_id == user?.id),
            );
            setLoading(false);
        };
        loadProduct();
    }, [user]);

    const openModal = () => {
        setModalOpen(true);
    }

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="SellerDashboard-main">
                    <h1>Seller dashboard</h1>
                    <div>Here the seller can manage their own items</div>
                    <ProductGrid products={userProducts} />
                    <button onClick={openModal}>Create product</button>
                </div>
            )}
            {isModalOpen &&
                createPortal(
                    <ProductModalWindow product={currentProduct} setModalOpen={setModalOpen}/>,
                    document.body,
                )}
        </>
    );
}
