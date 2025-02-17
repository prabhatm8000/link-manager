import { otpConfig } from "../constants/configs";
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
    const otpObj = await Otp.create({ email, otp: otp, expiresAt });
    if (!otpObj) {
        throw new Error("Failed to create OTP");
    }

    await sendOtpEmail(email, otp);
};

const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    const otpObj = await Otp.findOne({ email });

    if (!otpObj) {
        throw new Error("Invalid OTP");
    }

    if (otpObj.expiresAt < new Date()) {
        throw new Error("OTP has expired");
    }

    const isMatch = await otpObj.compareOtp(otp);
    if (!isMatch) {
        throw new Error("Invalid OTP");
    }

    await otpObj.deleteOne();
    return true;
};

const otpService = { genarateAndSendOtpViaMain, verifyOtp };
export default otpService;
