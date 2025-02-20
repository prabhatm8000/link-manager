import { otpConfig } from "../constants/configs";
import { APIResponseError } from "../errors/response";
import { sendOtpEmail } from "../lib/mail";
import Otp from "../models/otp";

const genarateOtp = (size: number = 6): string => {
    return Math.floor(Math.pow(10, size) * Math.random() + 9)
        .toString()
        .slice(0, size);
};

const genarateAndSendOtpViaMain = async (email: string) => {
    const otp = genarateOtp(otpConfig.size);
    const expiresAt = new Date(Date.now() + otpConfig.expiresAt);
    let otpObj = await Otp.findOne({ email });
    if (otpObj) {
        otpObj.otp = otp;
        otpObj.expiresAt = expiresAt;
    } else {
        otpObj = new Otp({ email, otp, expiresAt });    
    }
    await otpObj.save(); 

    if (!otpObj) {
        throw new Error("Failed to create or update OTP");
    }

    await sendOtpEmail(email, otp);
};

const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    const otpObj = await Otp.findOne({ email });

    if (!otpObj) {
        throw new APIResponseError("Invalid OTP", 400, false);
    }

    if (otpObj.expiresAt < new Date()) {
        throw new APIResponseError("OTP has expired", 400, false);
    }

    const isMatch = await otpObj.compareOtp(otp);
    if (!isMatch) {
        throw new APIResponseError("Invalid OTP", 400, false);
    }

    await otpObj.deleteOne();
    return true;
};

const otpService = { genarateAndSendOtpViaMain, verifyOtp };
export default otpService;
