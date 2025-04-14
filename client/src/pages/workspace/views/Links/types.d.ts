import type { ILink } from "@/redux/reducers/types";

type DropDownOptionsType = {
    label: string;
    icon: React.ReactNode;
    variant?: "default" | "destructive";
    onClick: (link: ILink) => void;
};
