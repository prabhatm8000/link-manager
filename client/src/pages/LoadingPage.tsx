import { IoIosLink } from "react-icons/io";

const LoadingPage = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <IoIosLink size={100} className="animate-pulse duration-300 ease-in-out" />
        </div>
    );
};

export default LoadingPage;
