import AppRouter from "./app/router/index";
import Header from "./widgets/Header/Header";

import { AuthContextProvider } from "./app/providers/authContextProvider/authContextProvider";

import "./index.css"

export default function App() {
    return (
        <>
            <AuthContextProvider>
                <Header />
                <AppRouter />
            </AuthContextProvider>
        </>
    );
}
