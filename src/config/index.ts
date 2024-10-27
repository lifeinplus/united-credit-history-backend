import type { CorsOptions } from "cors";
import dotenv from "dotenv";
import type { CookieOptions } from "express";
import type { Secret, SignOptions } from "jsonwebtoken";

interface Token {
    secret: Secret;
    options: SignOptions;
}

interface AuthOptions {
    accessToken: Token;
    refreshToken: Token;
    cookieOptions: CookieOptions;
    passwordDefaultReset: string;
    passwordLengthMin: number;
}

dotenv.config();

const {
    ACCESS_TOKEN_SECRET = "",
    ACCESS_TOKEN_EXPIRES_IN = "5m",
    REFRESH_TOKEN_SECRET = "",
    REFRESH_TOKEN_EXPIRES_IN = "1h",
    PASSWORD_DEFAULT_RESET = "",
    PASSWORD_LENGTH_MIN = "8",
    CORS_CREDENTIALS = "",
    CORS_ORIGIN = "",
    MONGO_PASSWORD = "",
    MONGO_PORT = "",
    MONGO_DBNAME = "",
    MONGO_USERNAME = "",
    SERVER_PORT = "1337",
    FILE_UPLOAD_SIZE_KB = "150",
} = process.env;

const auth: AuthOptions = {
    accessToken: {
        secret: ACCESS_TOKEN_SECRET,
        options: {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        },
    },
    refreshToken: {
        secret: REFRESH_TOKEN_SECRET,
        options: {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        },
    },
    cookieOptions: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
    passwordDefaultReset: PASSWORD_DEFAULT_RESET,
    passwordLengthMin: parseInt(PASSWORD_LENGTH_MIN),
};

const cors: CorsOptions = {
    credentials: CORS_CREDENTIALS.toLowerCase() === "true",
    origin: CORS_ORIGIN,
};

const mongo = {
    uri: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:${MONGO_PORT}/${MONGO_DBNAME}`,
};

const server = {
    port: parseInt(SERVER_PORT),
    fileUploadSizeKb: parseInt(FILE_UPLOAD_SIZE_KB),
};

export const config = {
    auth,
    cors,
    mongo,
    server,
};
