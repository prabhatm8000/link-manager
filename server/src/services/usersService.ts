import { APIResponseError } from "../errors/response";
import User from "../models/users";
import type { IUsersService } from "../types/user";

/**
 * 
 * @param email
 * @param password
 * @returns 
 */
const login = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new APIResponseError("Invalid email", 401, false);
    }

    if (!(await user.comparePassword(password))) {
        throw new APIResponseError("Invalid password", 401, false);
    }

    user.lastLogin = new Date();
    await user.save();

    return user.toJSON();
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
}: {
    name: string;
    email: string;
    password: string;
    profilePicture?: string;
}) => {
    const user = await User.create({
        name,
        email,
        password,
        profilePicture,
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
}

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
