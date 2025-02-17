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

const getUserById = async (id: string): Promise<IUser | null> => {
    const user = await User.findById(id);
    return user;
};

const updateUser = async (
    id: string,
    data: {
        name?: string;
        email?: string;
        password?: string;
        profilePicture?: string;
    }
): Promise<IUser | null> => {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    return user;
};

const deactivateUser = async (id: string): Promise<IUser | null> => {
    const user = await User.findByIdAndUpdate(
        id,
        {
            isActive: false,
        },
        { new: false }
    );
    return user;
};

const usersService = {
    login,
    createUser,
    getUserById,
    updateUser,
    deactivateUser,
};
export default usersService;
