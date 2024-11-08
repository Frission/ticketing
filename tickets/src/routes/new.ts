import { currentUser, requireAuth, validateRequest } from "@frissionapps/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"

const router = express.Router()

const createPostMiddlewares = [
    requireAuth,
    body("title").isString().notEmpty().withMessage("Please provide a title"),
    body("price")
        .notEmpty()
        .withMessage("Please provide a price")
        .isFloat({ gt: 0, max: 999999 })
        .withMessage("Please provide a valid price"),
    validateRequest,
]

router.post("/api/tickets", createPostMiddlewares, (req: Request, res: Response) => {
    res.send({})
})

export { router as createTicketRouter }
