import { IoIosLink } from "react-icons/io";

const LoadingPage = () => {
    return (
        <div className="fixed z-[999] h-screen w-screen top-0 right-0 flex justify-center items-center">
            <IoIosLink size={100} className="animate-pulse ease-in-out" />
        </div>
    );
};

export default LoadingPage;
