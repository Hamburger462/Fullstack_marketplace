import { useNavigate } from "react-router-dom";

import { type Product } from "../../entities/product/model/types";
import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";
import { deleteProduct } from "../../features/product/productAPI";

import styles from "./ProductCard.module.css";

export default function ProductCard({ product }: { product: Product }) {
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(product.id);
            navigate(-1);
        }
    };

    const isOwner =
        user && (product.seller_id === user.id || user.user_type === "admin");

    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(product.price);

    return (
        <div className={styles.card}>
            {/* ── Body ── */}
            <div className={styles.body}>
                <h2 className={styles.title}>{product.title}</h2>

                {product.description && (
                    <p className={styles.description}>{product.description}</p>
                )}
            </div>

            {/* ── Footer ── */}
            <div className={styles.footer}>
                <div className={styles.priceWrap}>
                    <span className={styles.price}>{formattedPrice}</span>
                </div>
                <button
                    className={styles.btnCart}
                    onClick={() => navigate(`/item/${product.id}`)}
                >
                    <i className="ti ti-shopping-cart" aria-hidden="true" />
                    Add
                </button>
            </div>

            {/* ── Owner / admin controls ── */}
            {isOwner && (
                <div className={styles.ownerBar}>
                    <button
                        className={styles.btnEdit}
                        onClick={() =>
                            navigate(`/seller/dashboard?item=${product.id}`)
                        }
                    >
                        <i className="ti ti-edit" aria-hidden="true" />
                        Edit
                    </button>
                    <button className={styles.btnDelete} onClick={handleDelete}>
                        <i className="ti ti-trash" aria-hidden="true" />
                        Delete
                    </button>
                </div>
            )}

        </div>
    );
}