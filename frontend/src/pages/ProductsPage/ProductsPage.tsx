import { useEffect, useState } from "react";

import { getAllProducts } from "../../features/product/productApi";

import ProductCard from "../../widgets/ProductCard/ProductCard";

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
                allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            )}
        </>
    );
}
