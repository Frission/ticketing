import { currentUser, requireAuth, validateRequest } from "@frissionapps/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"
import { Ticket } from "../models/Ticket"

const router = express.Router()

const createTicketMiddlewares = [
    requireAuth,
    body("title").isString().notEmpty().withMessage("Please provide a title"),
    body("price")
        .notEmpty()
        .withMessage("Please provide a price")
        .isFloat({ gt: 0, max: 999999 })
        .withMessage("Please provide a valid price"),
    validateRequest,
]

router.post("/api/tickets", createTicketMiddlewares, async (req: Request, res: Response) => {
    const { title, price } = req.body
    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id })
    await ticket.save()
    res.status(201).send(ticket)
})

export { router as createTicketRouter }
