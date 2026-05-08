import AppRouter from "./app/router/index";
import Header from "./widgets/Header/Header";

import { AuthContextProvider } from "./app/providers/authContextProvider/authContextProvider";

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
