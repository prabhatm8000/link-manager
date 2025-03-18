import Avatar from "../../../components/Avatar";
import type { ILink } from "../../../redux/reducers/types";

const LinkItem = ({ link }: { link: ILink }) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <span>{link.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
                <a href={`/${link.shortUrlKey}`} target="_blank">
                    {`/${link.shortUrlKey}`}
                </a>
                
                <div className="relative text-xs text-black/50 dark:text-white/50">
                    <span className="absolute top-[15%]">
                        <Avatar
                            props={{ alt: link?.creator?.name }}
                            size="sm"
                            title={link?.creator?.name || "U"}
                        />
                    </span>
                    <span className="pl-5 pb-">{link?.creator?.email}</span>
                </div>
            </div>
        </div>
    );
};

export default LinkItem;
