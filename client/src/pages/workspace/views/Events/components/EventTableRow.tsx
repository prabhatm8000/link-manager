// client/src/pages/workspace/views/Events/components/EventTableRow.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import type { IEvent } from "@/redux/reducers/types"; // Adjust the import based on your types
import { format } from "date-fns/format";
import { Link } from "react-router-dom";
import { iconsMap } from "./icons";

const EventTableRow = ({
    event,
    lastRowRef,
}: {
    event: IEvent;
    lastRowRef?: (element: HTMLDivElement | null) => void;
}) => {
    return (
        <TableRow ref={lastRowRef} key={event._id}>
            <TableCell>
                <Link
                    className="flex items-center gap-1"
                    to={`/${event.link.shortUrlKey}`}
                >
                    <Avatar>
                        <AvatarImage
                            src={event.link?.metadata?.favicon}
                            alt={event.link?.metadata?.title}
                        />
                        <AvatarFallback itemType="link" />
                    </Avatar>
                    <span>/{event.link.shortUrlKey}</span>
                </Link>
            </TableCell>

            <TableCell>
                <a
                    className="flex items-center gap-1"
                    href={event.link.destinationUrl}
                >
                    {event.link.destinationUrl}
                </a>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-1">
                    {iconsMap.getEventIcon(event.trigger)}
                    <span>{event.trigger?.toLocaleUpperCase()}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-1">
                    {iconsMap.getBrowserIcon(event.metadata.browser)}
                    <span>{event.metadata.browser?.toLocaleUpperCase()}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-1">
                    {iconsMap.getDeviceIcon(event.metadata.device)}
                    <span>{event.metadata.device?.toLocaleUpperCase()}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-1">
                    {iconsMap.getOSIcon(event.metadata.os)}
                    <span>{event.metadata.os?.toLocaleUpperCase()}</span>
                </div>
            </TableCell>

            <TableCell>{event.metadata.country}</TableCell>
            <TableCell>{event.metadata.region}</TableCell>
            <TableCell>{event.metadata.city}</TableCell>
            <TableCell>
                {`${format(new Date(event.createdAt), "MMM dd")} · ${format(
                    new Date(event.createdAt),
                    "hh:mm:ss a"
                )}`}
            </TableCell>
        </TableRow>
    );
};

export default EventTableRow;
