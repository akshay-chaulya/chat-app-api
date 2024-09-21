import { Response } from "express";
import { CustomRespons, ResponsStatus } from "../types";

const responseHandler = (res: Response, obj: CustomRespons = {}): Response => {
    return res.status(obj.statusCode || ResponsStatus.success).json({ success: true, ...obj, statusCode: undefined })
}

export default responseHandler;