import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    // transformResponse: (payload: any) => {
    //     const jsonPayload = JSON.parse(payload);
    //     if (jsonPayload.message) toast(jsonPayload.message);
    //     return payload;
    // },
    transformResponse: (payload: any) => {
        try {
            const jsonPayload = JSON.parse(payload);
            if (jsonPayload.message) toast(jsonPayload.message);
            return jsonPayload; // ✅ Return parsed JSON, not raw payload
        } catch (error) {
            return payload; // In case the response is not JSON
        }
    },
});

export default axiosInstance;
