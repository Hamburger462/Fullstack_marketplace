import { useEffect, useState } from "react";

import { getAllProducts } from "../../features/product/productAPI";

import ProductGrid from "../../widgets/ProductGrid/ProductGrid";

import type { Product } from "../../entities/product/model/types";

export default function ProductsPage() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadProduct = async () => {
            const data = await getAllProducts();
            setAllProducts(data as []);
            setLoading(false);
        };
        loadProduct();
    }, []);

    return (
        <>
            {loading ? (
                <div>Products are loading</div>
            ) : (
                <ProductGrid products={allProducts}/>
            )}
        </>
    );
}
