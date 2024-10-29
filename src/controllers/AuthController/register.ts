import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { config } from "../../config";
import ROLE_LIST from "../../config/role_list";
import Logging from "../../library/Logging";
import { UserModel } from "../../models";

const register = async (req: Request, res: Response) => {
    const { firstName, lastName, username, password, confirmPassword } =
        req.body;

    if (!firstName || !lastName || !username) {
        return res.status(400).json({
            message: `All user data is required`,
        });
    }

    if (
        !password ||
        password.length < config.auth.passwordLengthMin ||
        !confirmPassword ||
        confirmPassword.length < config.auth.passwordLengthMin
    ) {
        return res.status(400).json({
            message: `Passwords are required and should be at least ${config.auth.passwordLengthMin} characters long2`,
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            message: `Passwords do not match`,
        });
    }

    try {
        const foundUser = await UserModel.findOne({ username }).exec();

        if (foundUser) {
            return res.status(409).json({
                message: `Username already exists`,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            creationDate: new Date(),
            firstName,
            lastName,
            username,
            password: hashedPassword,
            roles: { user: ROLE_LIST.user },
        });

        return res.status(201).json({
            message: `User created successfully`,
        });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default register;
