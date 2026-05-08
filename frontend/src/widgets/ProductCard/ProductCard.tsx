import { type Product } from "../../entities/product/model/types";

import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

export default function ProductCard(props: { product: Product }) {
    const { product } = props;

    const { user } = useAuthContext();

    const checkButtons = () => {
        if(!user) return null;

        if(product.seller_id == user.id || user.user_type == "admin"){
            return (
            <>
                <button>Edit</button>
                <button>Delete</button>
            </>)
        }   
    }

    return (
        <>
            <h2>{product.title}</h2>
            <div>{product.price}</div>

            {checkButtons()}
        </>
    );
}
