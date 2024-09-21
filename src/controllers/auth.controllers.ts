import { Request, Response } from "express";
import { errorHandler, filteredUser, generateToken, responseHandler, throwError } from "../utils";
import { ResponsStatus } from "../types";
import prisma from "../db/prisma"
import bcrypt from "bcrypt"

export const getMe = (req: Request, res: Response) => {
    try {
        return responseHandler(res, { data: { user: req.user } });
    } catch (error) {
        console.log("Error in getMe controller: ", error);
        errorHandler(res, error);
    }
}

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return throwError({ message: "Empty cradentials", statusCode: ResponsStatus.NotFound })
        }

        if (password !== confirmPassword) {
            return throwError({ message: "Password doesn't match!", statusCode: ResponsStatus.BadRequest });
        }

        const user = await prisma.user.findUnique({ where: { username } });

        if (user) {
            return throwError({ message: "Username already exists", statusCode: ResponsStatus.BadRequest });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        let profilePic = gender === 'male' ? maleProfilePic : femaleProfilePic;

        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic
            }
        })

        generateToken(res, newUser.id);

        return responseHandler(res, { statusCode: ResponsStatus.Created, message: "Account created successfully", data: { user: filteredUser(newUser) } })

    } catch (error) {
        console.log("Error in signup controller: ", error);
        errorHandler(res, error);
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return throwError({ message: "Empty cradentials", statusCode: ResponsStatus.NotFound })
        }

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return throwError({ message: "User doesn't exists", statusCode: ResponsStatus.BadRequest })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password)

        if (!isPasswordCorrect) {
            return throwError({ message: "Incorract password", statusCode: ResponsStatus.Forbidden });
        }

        generateToken(res, user.id);

        return responseHandler(res, { statusCode: ResponsStatus.Accepted, message: "Logged in successfully", data: { user: filteredUser(user) } })
    } catch (error) {
        console.log("Error in login controller: ", error);
        errorHandler(res, error)
    }
}

export const logout = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return responseHandler(res, { message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller: ", error);
        errorHandler(res, error);
    }
}