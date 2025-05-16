export const convertToCSV = (data: Object[]) => {
    const header = Object.keys(data[0]).join(",");
    const rows = data.map((item: Object) => Object.values(item).join(","));
    return `${header}\n${rows.join("\n")}`;
}

export const getTheCSVBlob = (csv: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    return blob;
}