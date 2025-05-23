import LogoutBtn from "@/components/LogoutBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { UsageTooltip } from "@/pages/workspace/components/SideBarUsageBars";
import type { IUsageState, IUserState } from "@/redux/reducers/types";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const ProfileDetailCard = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const usageState: IUsageState = useSelector((state: any) => state.usage);
    const user = userState?.user;
    return (
        <Card>
            <CardHeader className="flex gap-5 items-center w-full">
                <Avatar className="size-20">
                    <AvatarImage
                        className="rounded-full"
                        src={user?.profilePicture || undefined}
                        alt={user?.name}
                    />
                    <AvatarFallback itemType="user" className="text-4xl">
                        {user?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <CardTitle className="flex flex-col justify-between sm:flex-row sm:items-center gap-4 w-full">
                    <div className="w-fit">
                        <h3 className="text-lg font-semibold line-clamp-1">
                            {user?.name}
                        </h3>
                        <h4 className="text-sm text-muted-foreground line-clamp-1">
                            {user?.email}
                        </h4>
                        {user?.lastLogin && (
                            <h4 className="text-sm text-muted-foreground line-clamp-1">
                                Last Login:{" "}
                                {format(new Date(user?.lastLogin), "PPPPpp")}
                            </h4>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">
                                Subscription Tier:
                            </span>
                            <UsageTooltip />
                            <span className="text-muted-foreground text-sm">
                                {usageState?.usage?.subscriptionTier}
                            </span>
                        </div>
                    </div>
                    <LogoutBtn />
                </CardTitle>
            </CardHeader>
        </Card>
    );
};

export default ProfileDetailCard;
