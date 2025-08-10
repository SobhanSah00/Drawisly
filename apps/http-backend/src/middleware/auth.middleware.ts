import {NextFunction,Request,Response} from "express"
import {verifiToken} from "../utils/jwt.util"

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}


export async function authenticatedUser(req:Request,res:Response,next:NextFunction) {
    let token = req.cookies['jwt'];

    if(!token) {
        const autheHeader = req.headers.authorization
        if(autheHeader?.startsWith("Bearer ")){
            // token = autheHeader?.substring(7)
            token = autheHeader.split(" ")[1];
        }
    }

    if(!token) {
        res.status(401).json({
            message : "User is not authorized ."
        })
        return;
    }

    try {
        const verifiedUser = verifiToken(token);

        if(!verifiedUser?.id) {
            res.status(401).json({
                message : "Invalid Token"
            })
            return;
        }

        req.userId = verifiedUser.id;
        next()
    } catch (error) {
        res.status(401).json({
            message : "Token verification failed"
        })
    }
}