import statusMessages from "../constants/messages";

export class APIResponseError extends Error {
    public status: number;
    public success: boolean;
    constructor(
        message: string | { title: string; description: string },
        status: number = 500,
        success: boolean = false
    ) {
        super(typeof message === "string" ? message : message.description);
        this.status = status;
        this.success = success;
    }
}
