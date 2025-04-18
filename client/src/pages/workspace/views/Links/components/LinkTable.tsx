import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { ILink } from "@/redux/reducers/types";
import type { DropDownOptionsType } from "../types";
import LinkTableRow from "./LinkTableRow";

const LinkTable = ({
    links,
    options,
}: {
    links: ILink[];
    options?: DropDownOptionsType[];
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Short Url</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {links.map((link) => (
                    <LinkTableRow key={link._id} link={link} options={options} />
                ))}
            </TableBody>
        </Table>
    );
};

export default LinkTable;
