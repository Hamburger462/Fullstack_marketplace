import AsyncStorage from "@react-native-async-storage/async-storage"

const TOKEN_KEY = "token"

export const tokenStorage ={
    async getToken(){
        return await AsyncStorage.getItem(TOKEN_KEY)
    },

    async setToken(token: string){
        await AsyncStorage.setItem(TOKEN_KEY,token)
    },

    async removeToken(){
        await AsyncStorage.removeItem(TOKEN_KEY)
    },
}
