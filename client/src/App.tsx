import { lazy } from "react";
import ThemeBtn from "./components/ThemeBtn";
import { ThemeProvider } from "./contexts/ThemeProvider";

const AppRouter = lazy(() => import("./AppRouter"));

const App = () => {
    return (
        <div className="">
            <ThemeProvider>
                <AppRouter />
                <ThemeBtn />
            </ThemeProvider>
        </div>
    );
};

export default App;
