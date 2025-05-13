import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { AppDispatch } from "@/redux/store";
import { deleteUser } from "@/redux/thunks/usersThunk";
import { useDispatch } from "react-redux";

const DeleteAccountCard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const handleDeleteAccountBtn = async () => {
        await dispatch(deleteUser());
    }
    return (
        <Card className="border-destructive lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex flex-col justify-between sm:flex-row sm:items-center gap-4 w-full text-destructive">
                    Delete Account
                </CardTitle>
                <CardDescription>
                        This will delete the account with all the workspaces,
                        links, events and analytical data.
                        This is operation can't be undone, think before
                        clicking!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="float-end" variant={"destructive"} onClick={handleDeleteAccountBtn}>Delete Account</Button>
            </CardContent>
        </Card>
    );
};

export default DeleteAccountCard;
