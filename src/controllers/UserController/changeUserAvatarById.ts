import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";

import Logging from "../../library/Logging";
import { UserModel } from "../../models";

const changeUserAvatarById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const avatar = req.files?.avatar as UploadedFile;

    if (!id) {
        return res.status(400).json({
            message: `User ID required`,
        });
    }

    try {
        const extName = path.extname(avatar.name);
        const relativePath = `uploads/users/${id}/avatar${extName}`;

        const uploadPath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            ...relativePath.split("/")
        );

        await avatar.mv(uploadPath);

        const user = await UserModel.findOne({ _id: id })
            .select("-password -refreshToken")
            .exec();

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.avatarPath = relativePath;
        await user.save();

        return res.json({ message: "Avatar uploaded successfully" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default changeUserAvatarById;
