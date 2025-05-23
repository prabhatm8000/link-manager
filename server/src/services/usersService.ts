import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import envVars from "../constants/envVars";
import { APIResponseError } from "../errors/response";
import oauthClient from "../lib/oAuthClient";
import EventUsage from "../models/eventUsage";
import Usage from "../models/usage";
import User from "../models/users";
import Workspace from "../models/workspaces";
import type { IUser, IUsersService } from "../types/user";
import workspacesService from "./workspacesService";

const JWT_SECRET = envVars.JWT_SECRET as string;

const genarateUserToken = (user: Pick<IUser, "_id" | "email">) => {
    const userId = user._id.toString();
    const token = jwt.sign({ email: user.email, userId }, JWT_SECRET, {
        expiresIn: "20m",
    });
    return token;
};

/**
 * --- local login ---
 * with email and password
 * returns the user, if exists else throws error
 *
 * --- google login ---
 * with credentialFromGoogleAuth
 * returns the user, if exists else creates a new user
 * @param param: {email: string, password: string, credentialFromGoogleAuth: any}
 * @returns
 */
const login = async ({
    email,
    password,
    credentialFromGoogleAuth,
}: {
    email?: string;
    password?: string;
    credentialFromGoogleAuth?: any;
}) => {
    let user = null;
    if (credentialFromGoogleAuth) {
        // perform google auth
        const ticket = await oauthClient.verifyIdToken({
            idToken: credentialFromGoogleAuth,
            audience: envVars.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new APIResponseError("Invalid token", 401, false);
        }

        const findingUser = await User.findOne({ email: payload.email });
        if (!findingUser && payload.email) {
            user = await createUser(
                {
                    name: payload.name || "",
                    email: payload.email,
                    profilePicture: payload.picture,
                    authType: "google",
                },
                {
                    creatingWhileLogin: true,
                }
            );
        } else {
            if (
                findingUser?.authType !== "google" &&
                !findingUser?.isVerified
            ) {
                throw new APIResponseError(
                    "Please use email and password to login",
                    400,
                    false
                );
            }
            user = findingUser;
        }
    } else {
        // perform normal login
        if (!email || !password) {
            throw new APIResponseError(
                "Email and password are required",
                400,
                false
            );
        }

        const findingUser = await User.findOne({ email });

        if (!findingUser) {
            throw new APIResponseError("Invalid email", 401, false);
        }
        if (findingUser.authType && findingUser.authType !== "local") {
            throw new APIResponseError(
                "Use different login method!",
                400,
                false
            );
        }

        if (!(await findingUser.comparePassword(password))) {
            throw new APIResponseError("Invalid password", 401, false);
        }

        if (!findingUser.isVerified) {
            throw new APIResponseError(
                {
                    title: "Looks like your account is not verified!",
                    description:
                        "To Verify: Put your email and password and click on 'send verfication'",
                },
                401,
                false
            );
        }
        user = findingUser;
        user.lastLogin = new Date();
        await user.save();
    }

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }

    return user as IUser;
};

/**
 *
 * @param: {name: string, email: string, password: string, profilePicture: string}
 * @returns
 */
const createUser = async (
    {
        name,
        email,
        password,
        profilePicture,
        authType,
    }: {
        name: string;
        email: string;
        password?: string;
        profilePicture?: string;
        authType?: "local" | "google";
    },
    options?: {
        session?: mongoose.ClientSession;
        creatingWhileLogin?: boolean;
    }
) => {
    const session = options?.session
        ? options?.session
        : await mongoose.startSession();
    if (!options?.session) {
        // session from outside will be handled from there only, don't care!
        session.startTransaction();
    }

    const userId = new mongoose.Types.ObjectId();
    const usageId = new mongoose.Types.ObjectId();
    const user = new User({
        _id: userId,
        name,
        email,
        password,
        profilePicture,
        isVerified: authType === "google", // in the case of google auth, the user is automatically verified
        authType,
        usageId,
        lastLogin: options?.creatingWhileLogin ? new Date() : undefined,
    });
    const usage = new Usage({
        _id: usageId,
        userId: user._id,
        workspaceCount: 1, // cause we are creating a dummy workspace
        linkCount: [],
    });
    const ws = new Workspace({
        name: "Dummy workspace",
        description:
            "This is a dummy workspace, you can delete it or rename it or create a new one, according to your needs.",
        createdBy: user._id,
        people: [user._id],
    });

    await user.save({ session });
    await usage.save({ session });
    await ws.save({ session });

    if (!options?.session) {
        // session from outside will be handled from there only, don't care!
        await session.commitTransaction();
    }
    return user.toJSON() as IUser;
};

const genarateEmailVerficationLink = (user: IUser) => {
    const userId = user._id.toString();
    const token = genarateUserToken(user);
    return {
        token,
        link: `${envVars.CLIENT_URL}/auth/emailverify?uid=${userId}&email=${user.email}&vt=${token}`,
    };
};

const genaratePasswordResetLink = (user: IUser) => {
    const userId = user._id.toString();
    const token = genarateUserToken(user);
    return {
        token,
        link: `${envVars.CLIENT_URL}/auth/passwordreset?uid=${userId}&email=${user.email}&vt=${token}`,
    };
};

/**
 * @param uid - user id
 * @param vt - verification token
 * @returns
 */
const verifyUserEmail = async (uid: string, vt: string) => {
    const id = new mongoose.Types.ObjectId(uid);
    const payload = jwt.verify(vt, JWT_SECRET) as {
        email: string;
        userId: string;
    };
    if (payload.userId !== id.toString()) throw new APIResponseError("Invalid verification link", 400, false);
    const user = await User.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(id),
            email: payload.email,
        },
        { isVerified: true },
        { new: true }
    );
    return user?.toJSON() as IUser;
};

const cancelVerificationAndDeleteUser = async (uid: string, vt: string) => {
    const id = new mongoose.Types.ObjectId(uid);
    const payload = jwt.verify(vt, JWT_SECRET) as {
        email: string;
        userId: string;
    };
    if (payload.userId !== id.toString()) {
        throw new APIResponseError("Invalid verification link", 400, false);
    }
    await deleteUser(id.toString());
};

/**
 * @param uid - user id
 * @param vt - verification token
 * @param pw - password
 * @returns
 */
const resetPassword = async (uid: string, vt: string, pw: string) => {
    const id = new mongoose.Types.ObjectId(uid);
    const payload = jwt.verify(vt, JWT_SECRET) as {
        email: string;
        userId: string;
    };
    if (payload.userId !== id.toString()) throw new APIResponseError("Invalid Reset link", 400, false);

    const user = await User.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(id),
            email: payload.email,
        },
        { password: pw },
        { new: true }
    );
    if (!user) throw new APIResponseError("User not found", 404, false);

    await user.save();
    return user.toJSON() as IUser;
};

/**
 * authentication required, [id is checked in the auth middleware]
 * @param id
 * @returns
 */
const getUserById = async (id: string) => {
    const user = await User.findById(id);
    return user?.toJSON() as IUser;
};

/**
 *
 * @param email
 * @returns
 */
const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    return user?.toJSON() as IUser;
};

/**
 * authentication required, [id is checked in the auth middleware]
 * @param id
 * @param data
 * @returns
 */
const updateUser = async (
    id: string,
    data: {
        name?: string;
        email?: string;
        password?: string;
        profilePicture?: string;
    }
) => {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    return user?.toJSON() as IUser;
};

/**
 * authentication required, [id is checked in the auth middleware]
 * @param id
 * @returns
 */
const deactivateUser = async (id: string) => {
    const user = await User.findByIdAndUpdate(
        id,
        {
            isActive: false,
        },
        { new: false }
    );
    return user?.toJSON() as IUser;
};

const deleteUser = async (userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findByIdAndDelete(userId, { session });
        if (!user) throw new APIResponseError("User not found", 404, false);

        const workspaces = await workspacesService.getAllWorkspacesForUser(
            userId
        );
        for (const ws of workspaces) {
            await workspacesService.deleteWorkspace(ws._id.toString(), userId, {
                session,
            });
        }
        await Usage.deleteOne({ userId }, { session });
        await EventUsage.deleteMany({ userId }, { session });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
};

const usersService: IUsersService = {
    login: login,
    createUser: createUser,
    genarateEmailVerficationLink: genarateEmailVerficationLink,
    genaratePasswordResetLink: genaratePasswordResetLink,
    verifyUserEmail: verifyUserEmail,
    cancelVerificationAndDeleteUser: cancelVerificationAndDeleteUser,
    resetPassword: resetPassword,
    getUserById: getUserById,
    getUserByEmail: getUserByEmail,
    updateUser: updateUser,
    deactivateUser: deactivateUser,
    deleteUser: deleteUser,
};

export default usersService;
