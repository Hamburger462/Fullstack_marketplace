import { useNavigate } from "react-router-dom";

import { type Product } from "../../entities/product/model/types";

import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

import { deleteProduct } from "../../features/product/productAPI";

export default function ProductCard(props: { product: Product }) {
    const navigate = useNavigate();
    const { product } = props;

    const { user } = useAuthContext();

    const handleDelete = async () => {
        if(confirm("Are you sure?")){
            await deleteProduct(product.id);
            navigate(-1);
        }
    }

    const checkButtons = () => {
        if(!user) return null;

        if(product.seller_id == user.id || user.user_type == "admin"){
            return (
            <>
                <button onClick={() => navigate(`/seller/dashboard?item=${product.id}`)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
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
