import { useRef, useState, useEffect } from "react";

import { type Product } from "../../entities/product/model/types";
import { type Rubric } from "../../entities/rubric/model/types";

import { addProduct, updateProduct } from "../../features/product/productAPI";

import styles from "./ProductModalWindow.module.css";

const titleRegex = /^[a-zA-Z0-9s-’]{3,50}$/; // 3-50 chars, alphanumeric, spaces, hyphens
const priceRegex = /^\d+(\.\d{1,2})?$/;

type ProductModalWindowProps = {
    product?: Product;
    rubrics: Array<Rubric>;
    setModalOpen: (value: boolean) => void;
};

export default function ProductModalWindow({
    product,
    rubrics,
    setModalOpen,
}: ProductModalWindowProps) {
    const backRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<number>(null); // Ref to hold our active timeout

    const [title, setTitle] = useState<string>(product?.title || "");
    const [desc, setDesc] = useState<string>(product?.description || "");
    const [price, setPrice] = useState<string>(
        product?.price?.toString() || "",
    );
    const [productRubric, setProductRubric] = useState<string>(product?.rubricId || rubrics[0]?.id || "");

    const timeoutTime = 200;
    const clickStartedOnBackdrop = useRef(false);

    // 2. Capture where the click begins
    const handleMouseDown = (event: React.MouseEvent) => {
        if (event.target === backRef.current) {
            clickStartedOnBackdrop.current = true;
        } else {
            clickStartedOnBackdrop.current = false;
        }
    };

    // 3. Handle the actual closing logic only if conditions match
    const handleMouseUp = (event: React.MouseEvent) => {
        event.stopPropagation();

        if (!backRef.current) return;

        // Check if it started on the backdrop AND ended on the backdrop
        if (
            clickStartedOnBackdrop.current &&
            event.target === backRef.current
        ) {
            backRef.current.style.opacity = "0";

            setTimeout(() => {
                setModalOpen(false);
            }, timeoutTime);
        }

        // Always reset the origin tracker for the next click interaction
        clickStartedOnBackdrop.current = false;
    };

    useEffect(() => {
        if (!backRef.current) return;

        // requestAnimationFrame tells the browser to wait until the next frame paint
        requestAnimationFrame(() => {
            if (backRef.current) {
                backRef.current.style.opacity = "1";
            }
        });
    }, []);

    const [errors, setErrors] = useState<{
        title?: string;
        price?: string;
    }>({});

    // 2. Main Validation Logic
    const validateFields = (currentTitle: string, currentPrice: string) => {
        const newErrors: typeof errors = {};

        if (currentTitle && !titleRegex.test(currentTitle)) {
            newErrors.title = "Title must be 3-50 alphanumeric characters.";
        }
        if (currentPrice && !priceRegex.test(currentPrice)) {
            newErrors.price = "Please enter a valid price (e.g., 49 or 49.99).";
        }

        setErrors(newErrors);
    };

    const triggerDebouncedValidation = (
        updatedTitle: string,
        updatedPrice: string,
    ) => {
        // Clear the previous timeout if the user is still actively typing
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set a new timeout to run validation 500ms after typing halts
        debounceTimerRef.current = setTimeout(() => {
            validateFields(updatedTitle, updatedPrice);
        }, 300);
    };

    // Clean up timers if the modal suddenly unmounts
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current)
                clearTimeout(debounceTimerRef.current);
        };
    }, []);

    const handleSubmit = async (event: React.MouseEvent, mode: string) => {
        event.preventDefault();
        // Prevent form submission if there are validation errors or empty crucial fields
        if (Object.keys(errors).length > 0 || !title || !price) {
            console.log("Form has errors or missing data. Cannot submit.");
            return;
        }
        console.log("Submitting safe data:", { title, desc, price });

        console.log(mode);
        switch (mode) {
            case "create":
                await addProduct({
                    title: title,
                    description: desc,
                    rubricId: productRubric,
                    price: Number(price),
                });
                break;
            case "update":
                if (!product?.id) return;
                await updateProduct(product?.id, {
                    title: title,
                    description: desc,
                    rubricId: productRubric,
                    price: Number(price),
                });
                break;
        }
        setModalOpen(false);
    };

    const handleSelect = (event: React.ChangeEvent) => {
        setProductRubric(event.target.value);
    }

    return (
        <div
            className={styles["ProductModal-back"]}
            onMouseDown={handleMouseDown} // Track the start
            onMouseUp={handleMouseUp}
            ref={backRef}
        >
            <div className={styles["ProductModal-main"]}>
                <form>
                    <label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Name"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                triggerDebouncedValidation(
                                    e.target.value,
                                    desc,
                                );
                            }}
                        />
                        {errors.title && (
                            <span className={styles.errorText}>
                                {errors.title}
                            </span>
                        )}
                    </label>

                    {/* Description Input */}
                    <label>
                        <input
                            type="text"
                            name="desc"
                            placeholder="Description"
                            value={desc}
                            onChange={(e) => {
                                setDesc(e.target.value);
                            }}
                        />
                    </label>

                    {/* Price Input */}
                    <label>
                        <input
                            type="text"
                            name="price"
                            placeholder="Price (in dollars)"
                            value={price}
                            onChange={(e) => {
                                setPrice(e.target.value);
                                triggerDebouncedValidation(
                                    title,
                                    e.target.value,
                                );
                            }}
                        />
                        {errors.price && (
                            <span className={styles.errorText}>
                                {errors.price}
                            </span>
                        )}
                    </label>

                    <label>
                        <select name="rubric" onChange={handleSelect}>
                            <option value="" disabled>Select a category</option>
                            {rubrics.map((rubric) => (
                                <option
                                    value={rubric.name}
                                    key={rubric.id}
                                    defaultValue={rubric.id == product?.rubricId ? rubric.name : ""}
                                >{rubric.name}</option>
                            ))}
                        </select>
                    </label>

                    {product ? (
                        <button
                            disabled={Object.keys(errors).length > 0}
                            onClick={(event) => handleSubmit(event, "update")}
                        >
                            Update product
                        </button>
                    ) : (
                        <button
                            disabled={Object.keys(errors).length > 0}
                            onClick={(event) => handleSubmit(event, "create")}
                        >
                            Create product
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
