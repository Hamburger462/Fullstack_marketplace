import { baseApi } from "../../shared/api/baseApi";
import { type Cart } from "../../entities/cart/model/type";

type CartPayload = {
    itemId?: string,
    quantity: number
};

export const addProductToCart = async (payload: CartPayload) => {
    try {
        const response = await baseApi.post(`/cart/`, payload);
        console.log(response)
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const updateProduct = async (itemId: string, payload: CartPayload) => {
    try{
        const response = await baseApi.patch(`/cart/${itemId}`, payload);
        return response.data;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

export const deleteProductFromCart = async (id: string) => {
    try{
        const response = await baseApi.delete(`/cart/${id}`);
        console.log(response);
        return response.data;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

export const getUserCart = async (): Promise<Cart | null> => {
    try {
        const response = await baseApi.get(`/cart/`);
        return response.data.items;
    } catch (err) {
        console.error(err);
        return null;
    }
};