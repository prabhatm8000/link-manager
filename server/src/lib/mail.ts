import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password",
    },
});

async function sendMail({
    to,
    subject,
    text,
    html,
}: {
    to: string;
    subject: string;
    text: string;
    html: string;
}) {
    const mailOptions = {
        from: "your-email@gmail.com",
        to: to,
        subject: subject,
        text: text,
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

async function sendOtpEmail(to: string, otp: string) {
    const mailObj = {
        to: to,
        subject: "OTP Verification - expires in 5 minutes",
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
        html: `<p>Your OTP is: ${otp}. It will expire in 5 minutes.</p>`,
    };
    await sendMail(mailObj);
}

async function sendVerificationEmail(to: string, token: string) {
    const mailObj = {
        to: to,
        subject: "Email Verification",
        text: `Click here to verify your email: http://localhost:3000/verify-email/${token}`,
        html: `<p>Click here to verify your email: <a href="http://localhost:3000/verify-email/${token}">Verify Email</a></p>`,
    };
    await sendMail(mailObj);
}

async function sendPasswordResetEmail(to: string, resetToken: string) {
    const mailObj = {
        to: to,
        subject: "Password Reset",
        text: `Click here to reset your password: http://localhost:3000/reset-password/${resetToken}`,
        html: `<p>Click here to reset your password: <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a></p>`,
    };
    await sendMail(mailObj);
}

export { sendOtpEmail, sendVerificationEmail, sendPasswordResetEmail };
