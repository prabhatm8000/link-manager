// client/src/pages/workspace/views/Events/components/EventTable.tsx
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { IEvent } from "@/redux/reducers/types"; // Adjust the import based on your types
import EventTableRow from "./EventTableRow";

const EventTable = ({
    events,
    lastRowRef,
}: {
    events: IEvent[];
    lastRowRef: (element: HTMLDivElement | null) => void;
}) => {
    const columns = [
        "Short Url",
        "Destination",
        "Trigger",
        "Browser",
        "Device",
        "OS",
        "Country",
        "Region",
        "City",
        "Date & Time",
    ];

    return (
        <Table className="">
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map((e, i) => {
                    return (
                        <EventTableRow
                            key={i}
                            event={e}
                            lastRowRef={
                                i === events.length - 1 ? lastRowRef : undefined
                            }
                        />
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default EventTable;
