import { NextFunction, Request, Response } from "express";
import { PaginationOptions } from "../types";

const pagination = (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = String(req.query.search || "");

    const skip = (page - 1) * limit;
    const from = page * limit - limit + 1;
    const to = page * limit;

    const paginationOptions: PaginationOptions = {
        page,
        limit,
        search,
        skip,
        from,
        to,
    };

    res.locals.paginationOptions = paginationOptions;

    next();
};

export default pagination;
