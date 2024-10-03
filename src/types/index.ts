import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface PaginationOptions {
    limit: number;
    page: number;
    search: string;
    skip: number;
    from: number;
    to: number;
}

export interface UserRequest extends Request {
    roles?: number[];
}

export interface UserJwtPayload extends JwtPayload {
    userName: string;
    roles: number[];
}
