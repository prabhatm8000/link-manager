import { Link } from "react-router-dom";
import TitleText from "../../../components/TitleText";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";

const AuthSignUp = () => {
    return (
        <Card variant="none" className="p-6 flex flex-col gap-4 w-full">
            <TitleText variant="none">Signup</TitleText>
            <div className="flex flex-col">
                <Input
                    type="name"
                    placeholder="Name"
                    variant="outline"
                    className="w-full"
                />
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
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    variant="outline"
                    className="w-full"
                />
                <Button className="my-5">Signup</Button>
            </div>
            <div className="text-center text-black/70 dark:text-white/70">
                already have an account?{" "}
                <Link to="/auth/login" className="text-blue-500">
                    Login
                </Link>
            </div>
        </Card>
    );
};

export default AuthSignUp;
