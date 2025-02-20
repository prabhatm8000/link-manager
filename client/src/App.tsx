import { lazy } from "react";
import ThemeBtn from "./components/ThemeBtn";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";

const AppRouter = lazy(() => import("./AppRouter"));

const App = () => {
    return (
        <div className="">
            <ThemeProvider>
                <Provider store={store}>
                    <AppRouter />
                    <ThemeBtn />
                    <ToastContainer theme="dark" />
                </Provider>
            </ThemeProvider>
        </div>
    );
};

export default App;
