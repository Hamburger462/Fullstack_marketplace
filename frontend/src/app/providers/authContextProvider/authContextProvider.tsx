import { createContext, useState } from "react";

import { type User } from "../../../entities/user/model/types";

export type AuthContextType = {
    user: User | null;
    setUser: (user: User) => void;

    token: string | null;
    setToken: (token: string) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type ProviderProps = {
    children: React.ReactNode;
};

export function AuthContextProvider({ children }: ProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    return (
        <>
            <AuthContext value={{ user, setUser, token, setToken }}>
                {children}
            </AuthContext>
        </>
    );
}
