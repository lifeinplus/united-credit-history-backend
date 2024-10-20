import { Request, Response } from "express";

import Logging from "../../library/Logging";
import { UserModel } from "../../models";
import type { PaginationOptions } from "../../types";

const getUsersPaginated = async (req: Request, res: Response) => {
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
            username: new RegExp(search, "i"),
        });

        const totalPages = Math.ceil(total / limit);
        const toEntry = to > total ? total : to;

        const users = await UserModel.find({
            username: new RegExp(search, "i"),
        })
            .skip(skip)
            .limit(limit)
            .select("-password -refreshTokens")
            .sort({ [sort]: order })
            .lean()
            .exec();

        const results = users.map((user) => ({
            ...user,
            roles: JSON.stringify(user.roles),
        }));

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

export default getUsersPaginated;
