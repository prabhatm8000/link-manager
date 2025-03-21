import axios from "axios";
import { toast } from "sonner";
// import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    transformResponse: (payload: any) => {
        const jsonPayload = JSON.parse(payload);
        try {
            if (!jsonPayload.message) {
                return jsonPayload;
            }
            if (jsonPayload.success) {
                // toast.success(jsonPayload.message);
                toast.success(jsonPayload.message, {
                    description: new Date().toLocaleString().split(",").join(" ·"),
                });
                
            } else {
                // toast.error(jsonPayload.message);
                toast.error(jsonPayload.message);
            }
            return jsonPayload;
        } catch (error) {
            return jsonPayload;
        }
    },
});

export default axiosInstance;
