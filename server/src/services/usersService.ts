import { APIResponseError } from "../errors/response";
import User, { type IUser } from "../models/users";

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

const getUserById = async (id: string) => {
    const user = await User.findById(id);
    return user?.toJSON();
};

const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    return user?.toJSON();
}

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

const usersService = {
    login,
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deactivateUser,
};
export default usersService;
