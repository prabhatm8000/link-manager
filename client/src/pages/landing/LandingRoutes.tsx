import { Route, Routes } from "react-router-dom";
import Landing from "./Landing";

const LandlingRoutes = () => {
    return (
        <Routes>
            <Route path="*" element={<Landing />} />
        </Routes>
    );
};

export default LandlingRoutes;
