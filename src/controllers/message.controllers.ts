import { Request, Response } from "express";
import { errorHandler, responseHandler, throwError } from "../utils";
import prisma from "../db/prisma";
import { ResponsStatus } from "../types";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        if (!message) {
            return throwError({ message: "Empty message", statusCode: ResponsStatus.BadRequest })
        }

        if (!receiverId) {
            return throwError({ message: "Empty reciever id", statusCode: ResponsStatus.BadRequest })
        }

        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                }
            }
        })

        // the very first message is being sent, that's why we need new conversation
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId]
                    }
                }
            })
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            }
        })

        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        }
                    }
                }
            })
        }

        // Socket io will go here

        return responseHandler(res, { statusCode: ResponsStatus.Created, data: { newMessage } })
    } catch (error) {
        console.log("Error in sendMessage controller: ", error);
        errorHandler(res, error);
    }
}

export const getMessage = async (req: Request, res: Response) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;

        if (!userToChatId) {
            return throwError({ message: "Empty params", statusCode: ResponsStatus.BadRequest })
        }

        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        })

        if (!conversation) {
            return responseHandler(res, { data: { allMessages: [] } });
        }

        return responseHandler(res, { data: { allMessages: conversation.messages } })
    } catch (error) {
        console.log("Error in getMessage controller: ", error);
        errorHandler(res, error);
    }
}

export const getConnectedUsers = async (req: Request, res: Response) => {
    try {
        const authUserId = req.user.id;

        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId
                }
            },
            select: { id: true, fullName: true, profilePic: true }
        })

        return responseHandler(res, { data: { users } })
    } catch (error) {
        console.log("Error in getConnectedUsers controller: ", error);
        errorHandler(res, error);
    }
}