import { apiClient } from "./apiClient";

export type CartPayload = {
    item_id?: string;
    quantity: number;
};

export const cartApi = {
    /**
     * Append a specific selected listing variant to the active session user's cart
     */
    async addProductToCart(payload: CartPayload) {
        try {
            const response = await apiClient.post("/item/", payload);
            return response.data;
        } catch (err) {
            console.error("React Native - addProductToCart failed:", err);
            return null;
        }
    },

    /**
     * Mutate count parameters for a targeted line entry element row inside the cart
     */
    async updateCartProduct(cartId: string, payload: CartPayload) {
        try {
            const response = await apiClient.patch(`/cart/${cartId}`, payload);
            return response.data;
        } catch (err) {
            console.error(`React Native - updateCartProduct (${cartId}) failed:`, err);
            return null;
        }
    },

    /**
     * Wipe a specific singular record item entry point row out from the array
     */
    async deleteProductFromCart(id: string) {
        try {
            const response = await apiClient.delete(`/cart/${id}`);
            return response.data;
        } catch (err) {
            console.error(`React Native - deleteProductFromCart (${id}) failed:`, err);
            return null;
        }
    },

    /**
     * Pull current updated active line array configurations for the authorized user
     */
    async getUserCart() {
        try {
            const response = await apiClient.get("/cart/");
            return response.data.items;
        } catch (err) {
            console.error("React Native - getUserCart failed:", err);
            return null;
        }
    }
};