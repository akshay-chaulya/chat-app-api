import jwt from "jsonwebtoken";
import { Response } from "express";
import { jwtSecret, nodeEnv } from "../config";

const generateToken = (res: Response, userId: string) => {
    const token = jwt.sign({ userId }, jwtSecret, {
        expiresIn: "15d"
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15day
        httpOnly: true, // prevent XSS cross site scripting
        sameSite: "strict", // CSRF attack cross-site request forgery
        secure: nodeEnv !== "development" // HTTPS
    })

    return token;
}

export default generateToken;