import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        export interface Request {
            user: User
        }
    }
}

export enum ResponsStatus {
    success = 200,
    Created = 201,
    Accepted = 202,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    RequestTimeout = 408,
    InternalServerError = 500,
}

export interface CustomError {
    statusCode: number;
    message: string;
}

export interface CustomRespons {
    statusCode?: number;
    message?: string;
    data?: any;
    token?: string;
    user?: any;
}

export interface User {
    id: string;
    username: string;
    fullName: string;
    profilePic: string;
}

export interface DecodedToken extends JwtPayload {
    userId: string;
}
