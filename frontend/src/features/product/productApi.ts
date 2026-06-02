import { baseApi } from "../../shared/api/baseApi";
import { type Product } from "../../entities/product/model/types";

type ProductPayload = {
    rubricId: string;
    title: string;
    description: string;
    price: number;
};

export const addProduct = async (payload: ProductPayload) => {
    try {
        const response = await baseApi.post("/items/", payload);
        console.log(response);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const updateProduct = async (id: string, payload: ProductPayload) => {
    try{
        const response = await baseApi.patch(`/items/${id}`, payload);
        console.log(response);
        return response.data;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

export const getAllProducts = async (): Promise<Product[] | null> => {
    try {
        const response = await baseApi.get("/items/");
        return response.data.items;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const getProductById = async (id: string): Promise<Product | null> => {
    try {
        const response = await baseApi.get(`/items/${id}`);
        return response.data.item;
    } catch (err) {
        console.error(err);
        return null;
    }
};
