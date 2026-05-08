import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "../../features/product/productApi";
import { type Product } from "../../entities/product/model/types";
import ProductCard from "../../widgets/ProductCard/ProductCard";

export default function ProductDetailsPage() {
    const { id } = useParams();

    const [product, setProduct] = useState<Product | null>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await getProductById(id as string);
                console.log(response)
                setProduct(response);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
            console.log("Download complete");
        };
        loadProduct();
    }, []);

    return (
        <>
            {loading ? (
                <div>Data is loading...</div>
            ) : product == null ? (
                <div>Product not found</div>
            ) : (
                <ProductCard product={product}></ProductCard>
            )}
        </>
    );
}
