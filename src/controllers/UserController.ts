import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";

import Logging from "../library/Logging";
import { UserModel } from "../models";
import type { PaginationOptions } from "../types";

export const getAll = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find()
            .select("-password -refreshToken")
            .sort("creationDate");

        const result = users.map((user) => {
            const { _id, creationDate, userName, roles } = user;
            return {
                _id,
                creationDate,
                userName,
                roles: JSON.stringify(roles),
            };
        });

        return result.length
            ? res.status(200).json(result)
            : res.status(404).json({ message: "Users not found" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const getPaginated = async (req: Request, res: Response) => {
    const {
        page,
        limit,
        search,
        skip,
        from,
        to,
        sort,
        order,
    }: PaginationOptions = res.locals.paginationOptions;

    try {
        const total = await UserModel.countDocuments({
            userName: new RegExp(search, "i"),
        });

        const totalPages = Math.ceil(total / limit);
        const toEntry = to > total ? total : to;

        const users = await UserModel.find({
            userName: new RegExp(search, "i"),
        })
            .skip(skip)
            .limit(limit)
            .select("-password -refreshToken")
            .sort({ [sort]: order })
            .exec();

        const results = users.map((user) => {
            const { _id, creationDate, userName, roles } = user;

            return {
                _id,
                creationDate,
                userName,
                roles: JSON.stringify(roles),
            };
        });

        const result = {
            results,
            page,
            total,
            totalPages,
            fromEntry: from,
            toEntry,
        };

        return result.results.length
            ? res.status(200).json(result)
            : res.sendStatus(204);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const changeAvatar = async (req: Request, res: Response) => {
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

export const updateById = async (req: Request, res: Response) => {
    const { id, roles } = req.body;

    if (!id) {
        return res.status(400).json({
            message: `User ID required`,
        });
    }

    try {
        const user = await UserModel.findOne({ _id: id })
            .select("-password -refreshToken")
            .exec();

        if (!user) {
            return res.sendStatus(204);
        }

        if (roles) {
            user.roles = JSON.parse(roles);
        }

        const result = await user.save();

        return res.json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const deleteById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: `User ID required`,
        });
    }

    try {
        const user = await UserModel.findOne({ _id: id })
            .select("-password -refreshToken")
            .exec();

        if (!user) {
            return res.sendStatus(204);
        }

        const result = await user.deleteOne({ _id: id });

        return res.json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};
