import { NextFunction, Request, Response } from "express";

interface PaginationOptions {
    limit: number;
    page: number;
    search: string;
    skip: number;
}

const pagination = (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = String(req.query.search || "");
    const skip = (page - 1) * limit;

    const paginationOptions: PaginationOptions = {
        page,
        limit,
        search,
        skip,
    };

    res.locals.paginationOptions = paginationOptions;

    next();
};

export default pagination;
