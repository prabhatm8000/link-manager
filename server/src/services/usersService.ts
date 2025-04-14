import envVars from "../constants/envVars";
import { APIResponseError } from "../errors/response";
import oauthClient from "../lib/oAuthClient";
import User from "../models/users";
import type { IUsersService } from "../types/user";

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
            user = new User({
                name: payload.name || "",
                email: payload.email,
                profilePicture: payload.picture,
                authType: "google",
            });
        } else {
            if (findingUser?.authType !== "google") {
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
                "Bad authentication type",
                400,
                false
            );
        }

        if (!(await findingUser.comparePassword(password))) {
            throw new APIResponseError("Invalid password", 401, false);
        }
        user = findingUser;
    }

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }
    user.lastLogin = new Date();
    await user.save();

    delete user.password;
    return user;
};

/**
 *
 * @param: {name: string, email: string, password: string, profilePicture: string}
 * @returns
 */
const createUser = async ({
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
}) => {
    const user = await User.create({
        name,
        email,
        password,
        profilePicture,
        authType,
    });
    return user.toJSON();
};

/**
 * authentication required, [id is checked in the auth middleware]
 * @param id
 * @returns
 */
const getUserById = async (id: string) => {
    const user = await User.findById(id);
    return user?.toJSON();
};

/**
 *
 * @param email
 * @returns
 */
const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    return user?.toJSON();
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
    return user?.toJSON();
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
    return user?.toJSON();
};

const usersService: IUsersService = {
    login,
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deactivateUser,
};

export default usersService;
