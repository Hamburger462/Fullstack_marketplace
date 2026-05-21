import { apiClient } from "./apiClient";
import { AuthResponse, LoginPayload,RegisterPayload } from "@/types/auth.types";

export const authApi = {
    async register(data: RegisterPayload){
        const response = await apiClient.post<AuthResponse>("/auth/register", data)
        return response.data
    },
    async login(data: LoginPayload){
        const response = await apiClient.post<AuthResponse>("/auth/login", data)
        return response.data
    },
    async me(){
        const response = await apiClient.get<AuthResponse>("/auth/me")
        return response.data
    }
}