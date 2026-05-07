import AppRouter from "./app/router/index";
import Header from "./widgets/Header/Header";

export default function App() {
  return (
    <>
      <Header />
      <AppRouter />
    </>
);
}