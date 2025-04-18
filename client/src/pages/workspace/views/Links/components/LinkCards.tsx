import type { ILink, LinkDisplayConfig } from "@/redux/reducers/types";
import type { DropDownOptionsType } from "../types";
import LinkCardItem from "./LinkCardItem";

const LinkCards = ({
    links,
    options,
    config
}: {
    links: ILink[];
    options: DropDownOptionsType[];
    config: LinkDisplayConfig;
}) => {
    return (
        <div className="flex flex-col gap-4">
            {links.map((link) => (
                <LinkCardItem
                    config={config}
                    key={link._id}
                    link={link}
                    options={options}
                />
            ))}
        </div>
    );
};

export default LinkCards;
