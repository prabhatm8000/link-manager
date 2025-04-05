import nodemailer from "nodemailer";
import envVars from "../constants/envVars";
import type { IUser } from "../types/user";
import type { IWorkspace } from "../types/workspace";
import { inviteConfig, otpConfig } from "../constants/configs";
import jwt from "jsonwebtoken";

const JWT_SECRET = envVars.JWT_SECRET as string;
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: envVars.EMAIL,
        pass: envVars.EMAIL_PASSWORD,
    },
});

/**
 * @param workspaceId Invite for which workspaceId
 * @param senderId Senders userId
 * @returns Invite link `{clientUrl}/invite/{workspaceId}/{userId}/{token}`
 */
const genarateInviteLink = (
    workspaceId: string,
    senderId: string,
    recipientEmail: string
): string => {
    const payload = { workspaceId, senderId, recipientEmail };
    const token = jwt.sign({ payload }, JWT_SECRET, {
        expiresIn: inviteConfig.expiresAt,
    });

    const inviteLink = `${envVars.CLIENT_URL}/invite/${workspaceId}/${senderId}/${token}`;
    return inviteLink;
};

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
        from: `Teleport - <${envVars.EMAIL}>`,
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
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}. It will expire in ${
            otpConfig.expiresAt / 60000
        } minutes.`,
        html: `<p>Your OTP is: ${otp}. It will expire in ${
            otpConfig.expiresAt / 60000
        } minutes.</p>`,
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

async function sendInviteToJoinWorkspaceMail(
    to: string,
    workspace: Pick<IWorkspace, "id" | "name">,
    senderUser: IUser
) {
    const inviteLink = genarateInviteLink(
        workspace.id,
        senderUser.id,
        to
    );
    const mailObj = {
        to,
        subject: `Invited by ${senderUser.name} to join workspace`,
        text: `You have been invited by \nName: ${senderUser.name}\nEmail: ${senderUser.email}\nto join ${workspace.name} workspace.\n\nClick here to join: ${inviteLink}`,
        html: `<p>You have been invited by</p>
                <p>Name: ${senderUser.name}</p>
                <p>Email: ${senderUser.email}</p>
                <p>to join ${workspace.name} workspace.</p>
                <p>Click here to join: <a href="${inviteLink}">${inviteLink}</a></p>`,
    };
    await sendMail(mailObj);
}

export {
    sendOtpEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendInviteToJoinWorkspaceMail,
};
