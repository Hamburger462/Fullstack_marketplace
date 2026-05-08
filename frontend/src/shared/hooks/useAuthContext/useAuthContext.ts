import { useContext, useEffect } from "react";

import { AuthContext } from "../../../app/providers/authContextProvider/authContextProvider";
import { tokenStorage } from "../../lib/tokenStorage";

export function useAuthContext(){
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }

    useEffect(() => {
        const token = tokenStorage.get();
        if(!token) return;
        context.setToken(token);
    }, [])

    const setToken = (token: string) => {
        tokenStorage.set(token);
        context.setToken(token);
    };

    const deleteToken = () => {
        tokenStorage.remove();
        context.setToken("");
    }

    return {
        user: context.user,
        setUser: context.setUser,
        token: context.token,
        setToken,
        deleteToken,
    }
}