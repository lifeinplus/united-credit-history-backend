import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { SortOrder } from "mongoose";

export interface PaginationOptions {
    limit: number;
    page: number;
    search: string;
    skip: number;
    from: number;
    to: number;
    sort: string;
    order: SortOrder;
}

export interface UserRequest extends Request {
    roles?: number[];
    userId?: string;
}

export interface UserJwtPayload extends JwtPayload {
    username: string;
    roles: number[];
}
