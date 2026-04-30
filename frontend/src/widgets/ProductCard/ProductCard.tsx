import { type Product } from "../../entities/product/model/types";

export default function ProductCard(props: { product: Product }) {
    const { product } = props;

    return (
        <div>
            <h2>{product.title}</h2>
            <div>{product.price}</div>
        </div>
    );
}
