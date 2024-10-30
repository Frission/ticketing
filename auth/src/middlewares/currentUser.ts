import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

interface UserPayload {
    id: string
    email: string
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.jwt != null) {
        try {
            const user = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload
            req.currentUser = user
        } catch (err) {
            console.error(err)
        }
    }

    next()
}
