import { lazy } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "./contexts/ThemeProvider";
import store from "./redux/store";
import SuspenseWrapper from "./components/SuspenseWrapper";

const AppRouter = lazy(() => import("./AppRouter"));

const App = () => {
    return (
        <div className="">
            <ThemeProvider>
                <Provider store={store}>
                    <SuspenseWrapper>
                        <AppRouter />
                    </SuspenseWrapper>
                </Provider>
            </ThemeProvider>
        </div>
    );
};

export default App;
