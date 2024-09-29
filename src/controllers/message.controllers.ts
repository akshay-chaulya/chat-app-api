import { Request, Response } from "express";
import { errorHandler, responseHandler, throwError } from "../utils";
import prisma from "../db/prisma";
import { ResponsStatus } from "../types";
import { getReceiverSocketId, io } from "../socket";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        const receiverId = req.params.id as string | undefined;
        const senderId = req.user.id;

        if (!text) {
            return throwError({ message: "Empty text", statusCode: ResponsStatus.BadRequest })
        }

        if (!receiverId) {
            return throwError({ message: "Empty id", statusCode: ResponsStatus.BadRequest })
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
                    },
                }
            })
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                text,
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
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return responseHandler(res, { statusCode: ResponsStatus.Created, data: newMessage })
    } catch (error) {
        console.log("Error in sendMessage controller: ", error);
        errorHandler(res, error);
    }
}
export const getMessages = async (req: Request, res: Response) => {
    try {
        const id1 = req.user.id; // Current user's ID
        const id2 = req.params.id as string | undefined; // ID of the other user

        // Check if id2 is provided in the request params
        if (!id2) {
            return throwError({ message: "Empty id in params", statusCode: ResponsStatus.BadRequest });
        }

        // Fetch the conversation and its messages in one query
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [id1, id2],
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc", // Order messages by creation date
                    },
                    select: {
                        id: true,
                        text: true,
                        senderId: true,
                        createdAt: true,
                    }
                }
            },
        });

        // Respond with the fetched messages
        return responseHandler(res, { data: conversation?.messages || [] });
    } catch (error) {
        console.log("Error in getMessage controller: ", error);
        return errorHandler(res, error); // Ensure the error handler returns a response
    }
};
