import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import TitleText from "../../../components/TitleText";
import { useForm } from "react-hook-form";

const AuthLogin = () => {
    const {
        register,
        handleSubmit,
    } = useForm();

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    });

    return (
        <Card variant="none" className="p-6 flex flex-col gap-4 w-full">
            <TitleText variant="none">Login</TitleText>
            <form className="flex flex-col" onSubmit={onSubmit}>
                <Input
                    {...register("email", { required: true })}
                    id="email"
                    type="email"
                    placeholder="Email"
                    variant="outline"
                    className="w-full"
                    autoComplete="email"
                />
                <Input
                    {...register("password", { required: true })}
                    id="password"
                    type="password"
                    placeholder="Password"
                    variant="outline"
                    className="w-full"
                    autoComplete="password"
                />
                <Button className="my-5">Login</Button>
            </form>
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
