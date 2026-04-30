import { baseApi } from "../../shared/api/baseApi";
import { type Product } from "../../entities/product/model/types";

export const getAllProducts = async (): Promise<Product[] | null> => {
    try{
        const response = await baseApi.get("/items/");
        console.log(response.data)
        return response.data.items;
    }
    catch(err){
        console.error(err);
        return null;
    }
}

export const getProductById = async (id: string): Promise<Product | null> => {
    try{
        const response = await baseApi.get(`/items/${id}`);
        return response.data;
    }
    catch(err){
        console.error(err);
        return null;
    }
}