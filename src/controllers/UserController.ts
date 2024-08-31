import { Request, Response } from "express";
import { UserModel } from "../models";

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
        return res.status(500).json({ error });
    }
};

export const getPaginated = async (req: Request, res: Response) => {
    const { page, limit, search, skip } = res.locals.paginationOptions;

    try {
        const total = await UserModel.countDocuments({
            userName: new RegExp(search, "i"),
        });

        const totalPages = Math.ceil(total / limit);

        const users = await UserModel.find({
            userName: new RegExp(search, "i"),
        })
            .skip(skip)
            .limit(limit)
            .select("-password -refreshToken")
            .sort("creationDate")
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

        const result = { results, page, total, totalPages };

        return result.results.length
            ? res.status(200).json(result)
            : res.sendStatus(204);
    } catch (error) {
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

        if (roles) user.roles = JSON.parse(roles);

        const result = await user.save();

        return res.json(result);
    } catch (error) {
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
        return res.status(500).json({ error });
    }
};
