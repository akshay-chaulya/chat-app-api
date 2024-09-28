import { Request, Response } from "express";
import { errorHandler, responseHandler, throwError } from "../utils";
import prisma from "../db/prisma";
import { ResponsStatus } from "../types";

export const searchUsers = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string | undefined;

        if (!query || query?.length < 3) {
            return responseHandler(res, { data: [] });
        }

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        id: { not: req.user.id }
                    }, {
                        OR: [
                            {
                                fullName: {
                                    contains: query,
                                    mode: "insensitive",
                                }
                            },
                            {
                                email: {
                                    contains: query,
                                    mode: "insensitive",
                                }
                            }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                profilePic: true, // Adjust fields as necessary
            },
        });

        // If no users are found
        if (users.length === 0) {
            throwError({ message: "No users found!", statusCode: ResponsStatus.NotFound });
        }

        return responseHandler(res, { message: "Users found", data: users })

    } catch (error) {
        console.log("Error in searchUsers controller: ", error)
        errorHandler(res, error)
    }
}


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const authUserId = req.user.id;

        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId,
                }
            },
        })


        return responseHandler(res, { data: users });
    } catch (error) {
        console.log("Error in getGroupConversations controller: ", error);
        errorHandler(res, error);
    }
};


// export const createConversation = async (req: Request, res: Response) => {
//     try {
//         const senderId = req.user.id
//         const receiverId = req.params.id as string | undefined;

//         if (!receiverId) {
//             return throwError({ message: "Requested user id not given", statusCode: ResponsStatus.BadRequest })
//         }

//         const receiver = await prisma.user.findUnique({
//             where: {
//                 id: receiverId,
//             },
//             select: { fullName: true, profilePic: true }
//         })

//         if (!receiver) {
//             return throwError({ message: "Invalid receiver id", statusCode: ResponsStatus.Forbidden })
//         }

//         await prisma.conversation.create({
//             data: {
//                 name: receiver.fullName,
//                 logoUrl: receiver.profilePic,
//                 participantIds: [senderId, receiverId]
//             }
//         })

//         return responseHandler(res, { message: "Request sended!" })
//     } catch (error) {
//         console.log("Error in createConversation controller: ", error)
//         errorHandler(res, error)
//     }
// }

// export const verifyConversation = async (req: Request, res: Response) => {
//     try {
//         const authUserId = req.user.id;
//         const conversationId = req.query.id as string | undefined;

//         if (!conversationId) {
//             return throwError({ message: "Empty id", statusCode: ResponsStatus.BadRequest })
//         }

//         await prisma.conversation.update({
//             where: {
//                 id: conversationId,
//                 participantIds: {
//                     has: authUserId
//                 }
//             },
//             data: {
//                 verified: true,
//             }
//         })
//     } catch (error) {
//         console.log("Error in verifyConversation controller: ", error)
//         errorHandler(res, error)
//     }
// }