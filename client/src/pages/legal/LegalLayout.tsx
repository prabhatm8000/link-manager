import Logo from "@/components/ui/Logo";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const LegalLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="max-w-7xl mx-auto py-4 px-6">
            <Link to="/" className="hidden md:block">
                <Logo className="" />
            </Link>
            <div className="md:mt-6">{children}</div>
        </div>
    );
};

export default LegalLayout;
