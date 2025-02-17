import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import TitleText from "../../../components/TitleText";

const AuthLogin = () => {
    return (
        <Card variant="none" className="p-6 flex flex-col gap-4 w-full">
            <TitleText variant="none">Login</TitleText>
            <div className="flex flex-col">
                <Input
                    type="email"
                    placeholder="Email"
                    variant="outline"
                    className="w-full"
                />
                <Input
                    type="password"
                    placeholder="Password"
                    variant="outline"
                    className="w-full"
                />
                <Button className="my-5">Login</Button>
            </div>
            <div className="text-center text-black/70 dark:text-white/70">
                don't have an account?{" "}
                <Link to="/auth/signup" className="text-blue-500">
                    Signup
                </Link>
            </div>
        </Card>
    );
};

export default AuthLogin;
