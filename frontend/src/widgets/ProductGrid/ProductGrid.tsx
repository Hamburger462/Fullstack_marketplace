import { useNavigate } from "react-router-dom";

import { type Product } from "../../entities/product/model/types";

export default function ProductGrid(props: { products: Array<Product> }) {
    const { products } = props;

    const navigate = useNavigate();

    const chooseProduct = (id: string) => {
        navigate(`/item/${id}`);
    }

    return products.map((product) => (
        <div key={product.id}>
            <h2>{product.title}</h2>
            <div>{product.price}</div>
            <button onClick={() => chooseProduct(product.id as string)}>See more</button>
        </div>
    ));
}
