import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { inviteConfig } from "../constants/configs";
import envVars from "../constants/envVars";
import type { IUser } from "../types/user";
import type { IWorkspace } from "../types/workspace";

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

async function sendVerificationEmail(to: string, verficationLink: string) {
    const mailObj = {
        to: to,
        subject: "Ref.com - Email Verification",
        text: `An attempt was made to create an account on Ref.com. Verify your email by clicking the verify email link, ignoring this email if you did not create an account.`,
        html: `
            <p>An attempt was made to create an account on Ref.com. Verify your email by clicking the verify email link, ignoring this email if you did not create an account.</p>
            <p style="text-align: center; padding: 0px 20px;"><a href="${verficationLink}" style="text-decoration: none; color: blue; font-weight: bold; padding: 5px 10px; border-radius: 5px;">Verify Email</a></p>
        `,
    };
    await sendMail(mailObj);
}

async function sendPasswordResetEmail(to: string, resetLink: string) {
    const mailObj = {
        to: to,
        subject: "Ref.com - Password Reset",
        text: `An attempt was made to reset your account password on Ref.com. Click the link below to reset your password, ignoring this email if you did not request a password reset.`,
        html: `
            <p>An attempt was made to reset your account password on Ref.com. Click the link below to reset your password, ignoring this email if you did not request a password reset.</p>
            <p style="text-align: center; padding: 0px 20px;"><a href="${resetLink}" style="text-decoration: none; color: blue; font-weight: bold; padding: 5px 10px; border-radius: 5px;">Reset Password</a></p>
        `
    };
    await sendMail(mailObj);
}

async function sendInviteToJoinWorkspaceMail(
    to: string,
    workspace: Pick<IWorkspace, "id" | "name">,
    senderUser: IUser
) {
    const inviteLink = genarateInviteLink(workspace.id, senderUser._id.toString(), to);
    const mailObj = {
        to,
        subject: `Invited by ${senderUser.name} to join workspace`,
        text: `You have been invited by \nName: ${senderUser.name}\nEmail: ${senderUser.email}\nto join '${workspace.name}' workspace.\n\nClick here to join: ${inviteLink}`,
        html: `<p>You have been invited by</p>
                <p>Name: ${senderUser.name}</p>
                <p>Email: ${senderUser.email}</p>
                <p>to join ${workspace.name} workspace.</p>
                <p>Click here to join: <a href="${inviteLink}">${inviteLink}</a></p>`,
    };
    
    await sendMail(mailObj);
}

export {
    sendInviteToJoinWorkspaceMail, sendPasswordResetEmail, sendVerificationEmail
};

