import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { useSearchParams } from "react-router-dom";

import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

import { getAllProducts } from "../../features/product/productAPI";
import { getAllRubrics } from "../../features/rubrics/rubricsAPI";

import { type Product } from "../../entities/product/model/types";
import { type Rubric } from "../../entities/rubric/model/types";

import ProductCard from "../../widgets/ProductCard/ProductCard";
import ProductModalWindow from "../../widgets/ProductModalWindow/ProductModalWindow";

export default function SellerDashboardPage() {
    const { user } = useAuthContext();
    const [userProducts, setUserProducts] = useState<Product[]>([]);
    const [allRubrics, setAllRubrics] = useState<Rubric[]>([]);
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

        const loadRubric = async () => {
            const data = await getAllRubrics();
            if (!data) return;
            setAllRubrics(data.items);
            setLoading(false);
        };
        loadRubric();
    }, [user, isModalOpen]);

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="SellerDashboard-main">
                    <h1>Seller dashboard</h1>
                    <div>Here the seller can manage their own items</div>
                    {userProducts.map((product) => (
                        <ProductCard product={product} key={product.id} />
                    ))}
                    <div>
                        <button onClick={() => setModalOpen(true)}>
                            Create product
                        </button>
                    </div>
                </div>
            )}
            {isModalOpen &&
                createPortal(
                    <ProductModalWindow
                        product={currentProduct}
                        rubrics={allRubrics}
                        setModalOpen={setModalOpen}
                    />,
                    document.body,
                )}
        </>
    );
}
