export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    email: string;
    password: string;
};
export type User ={
    id: number | string;
    name: string;
    email: string;
}
export type AuthResponse = {
    user: User;
    token: string;
}