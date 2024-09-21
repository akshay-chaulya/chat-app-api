import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { errorHandler, throwError } from "../utils";
import { DecodedToken, ResponsStatus } from "../types";
import { jwtSecret } from "../config";
import prisma from "../db/prisma";

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return throwError({ message: "Unauthorized - No token provided", statusCode: ResponsStatus.Unauthorized });
        }

        const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

        if (!decoded) {
            return throwError({ message: "Unauthorized - Invalid Token", statusCode: ResponsStatus.Unauthorized });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, username: true, fullName: true, profilePic: true } });

        if (!user) {
            return throwError({ message: "User not found", statusCode: ResponsStatus.NotFound });
        }

        req.user = user;

        next();
    } catch (error) {
        errorHandler(res, error)
    }
}

export default protectRoute;