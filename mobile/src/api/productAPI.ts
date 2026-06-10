import { apiClient } from "./apiClient";

// TypeScript declarations matching your types framework
export type ProductPayload = {
    rubricId: string;
    title: string;
    description?: string;
    price: number;
};

export const itemApi = {
    /**
     * Fetch all available marketplace catalog listings
     */
    async getAllProducts() {
        try {
            const response = await apiClient.get("/items/");
            return response.data.items;
        } catch (err) {
            console.error("React Native - getAllProducts failed:", err);
            return null;
        }
    },

    /**
     * Fetch single target product summary metrics by query key parameter
     */
    async getProductById(id: string) {
        try {
            const response = await apiClient.get(`/items/${id}`);
            return response.data;
        } catch (err) {
            console.error(`React Native - getProductById (${id}) failed:`, err);
            return null;
        }
    },

    /**
     * Dispatch new catalog payload asset creation values to server records
     */
    async addProduct(payload: ProductPayload) {
        try {
            const response = await apiClient.post("/items/", payload);
            return response.data;
        } catch (err) {
            console.error("React Native - addProduct failed:", err);
            return null;
        }
    },

    /**
     * Modify specific structural metadata variables on an active item block
     */
    async updateProduct(id: string, payload: ProductPayload) {
        try {
            const response = await apiClient.patch(`/items/${id}`, payload);
            return response.data;
        } catch (err) {
            console.error(`React Native - updateProduct (${id}) failed:`, err);
            return null;
        }
    },

    /**
     * Remove product indexing data permanently from cloud architecture
     */
    async deleteProduct(id: string) {
        try {
            const response = await apiClient.delete(`/items/${id}`);
            return response.data;
        } catch (err) {
            console.error(`React Native - deleteProduct (${id}) failed:`, err);
            return null;
        }
    }
};