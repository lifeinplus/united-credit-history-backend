import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserRequest extends Request {
    roles?: number[];
}

export interface UserJwtPayload extends JwtPayload {
    userName: string;
    roles: number[];
}
