export interface IOtp extends mongoose.Document {
    email: string;
    otp: string;
    createdAt: Date;
    expiresAt: Date;
    compareOtp(otp: string): Promise<boolean>;
}