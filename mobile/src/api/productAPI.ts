import { apiClient } from "./apiClient";
import { Item } from "@/types/product.types";

export const itemApi = {
    async getAllProducts(){
        const response = await apiClient.get("/items/")
        console.log(response.data)
        return response.data.items
    },
}