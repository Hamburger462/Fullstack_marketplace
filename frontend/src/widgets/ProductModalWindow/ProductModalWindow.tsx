import { useRef, useState } from "react";

import { type Product } from "../../entities/product/model/types";

import { addProduct, updateProduct } from "../../features/product/productApi";

import styles from "./ProductModalWindow.module.css";

type ProductModalWindowProps = {
    product?: Product;
    setModalOpen: (value: boolean) => void;
};

export default function ProductModalWindow({
    product,
    setModalOpen,
}: ProductModalWindowProps) {
    const backRef = useRef<HTMLDivElement>(null);

    const [title, setTitle] = useState<string>(product?.title || "");
    const [desc, setDesc] = useState<string>(product?.description || "");
    const [price, setPrice] = useState<string>(String(product?.price) || "");

    

    const closeModal = (event: React.MouseEvent) => {
        event.stopPropagation();

        if (event.target == backRef.current) {
            setModalOpen(false);
        }
    };

    return (
        <div
            className={styles["ProductModal-back"]}
            onClick={closeModal}
            ref={backRef}
        >
            <div className={styles["ProductModal-main"]}>
                <form>
                    <label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter a product name"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </label>
                    <label>
                        <input
                            type="text"
                            name="desc"
                            placeholder="Enter a product description"
                            value={desc}
                            onChange={(event) => setDesc(event.target.value)}
                        />
                    </label>
                    <label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Enter a product price"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                        />
                    </label>
                </form>
                {product ? (
                    <button>Update product</button>
                ) : (
                    <button>Create product</button>
                )}
            </div>
        </div>
    );
}
