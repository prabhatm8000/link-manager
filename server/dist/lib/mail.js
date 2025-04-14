"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendInviteToJoinWorkspaceMail = sendInviteToJoinWorkspaceMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const envVars_1 = __importDefault(require("../constants/envVars"));
const configs_1 = require("../constants/configs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = envVars_1.default.JWT_SECRET;
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: envVars_1.default.EMAIL,
        pass: envVars_1.default.EMAIL_PASSWORD,
    },
});
/**
 * @param workspaceId Invite for which workspaceId
 * @param senderId Senders userId
 * @returns Invite link `{clientUrl}/invite/{workspaceId}/{userId}/{token}`
 */
const genarateInviteLink = (workspaceId, senderId, recipientEmail) => {
    const payload = { workspaceId, senderId, recipientEmail };
    const token = jsonwebtoken_1.default.sign({ payload }, JWT_SECRET, {
        expiresIn: configs_1.inviteConfig.expiresAt,
    });
    const inviteLink = `${envVars_1.default.CLIENT_URL}/invite/${workspaceId}/${senderId}/${token}`;
    return inviteLink;
};
function sendMail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, subject, text, html, }) {
        const mailOptions = {
            from: `Teleport - <${envVars_1.default.EMAIL}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
        }
        catch (error) {
            console.error("Error sending email:", error);
        }
    });
}
function sendOtpEmail(to, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailObj = {
            to: to,
            subject: "OTP Verification",
            text: `Your OTP is: ${otp}. It will expire in ${configs_1.otpConfig.expiresAt / 60000} minutes.`,
            html: `<p>Your OTP is: ${otp}. It will expire in ${configs_1.otpConfig.expiresAt / 60000} minutes.</p>`,
        };
        yield sendMail(mailObj);
    });
}
function sendVerificationEmail(to, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailObj = {
            to: to,
            subject: "Email Verification",
            text: `Click here to verify your email: http://localhost:3000/verify-email/${token}`,
            html: `<p>Click here to verify your email: <a href="http://localhost:3000/verify-email/${token}">Verify Email</a></p>`,
        };
        yield sendMail(mailObj);
    });
}
function sendPasswordResetEmail(to, resetToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailObj = {
            to: to,
            subject: "Password Reset",
            text: `Click here to reset your password: http://localhost:3000/reset-password/${resetToken}`,
            html: `<p>Click here to reset your password: <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a></p>`,
        };
        yield sendMail(mailObj);
    });
}
function sendInviteToJoinWorkspaceMail(to, workspace, senderUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const inviteLink = genarateInviteLink(workspace.id, senderUser.id, to);
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
        yield sendMail(mailObj);
    });
}
