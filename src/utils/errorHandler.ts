import { Response } from "express";
import { CustomError, ResponsStatus } from "../types"

const throwError = ({ message, statusCode }: CustomError): CustomError => {
    throw { message, statusCode }
}

const isCustomError = (error: any): error is CustomError => {
    return (error && typeof error === 'object' && 'statusCode' in error && 'message' in error);
}

const errorHandler = (res: Response, error: unknown): Response => {
    if (isCustomError(error)) {
        return res.status(error.statusCode).json({ message: error.message, success: false });
    } else {
        return res.status(ResponsStatus.InternalServerError).json({
            message: "Server Error. Try again later.",
            success: false
        })
    }
}

export { errorHandler, throwError };