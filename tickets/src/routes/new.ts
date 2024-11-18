import { requireAuth, validateRequest } from "@frissionapps/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"
import { Ticket } from "../models/Ticket"
import { TicketCreatedPublisher } from "../events/publishers/TicketCreatedPublisher"
import { natsWrapper } from "../util/NatsWrapper"

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
    console.log("created ticket", ticket.toJSON())
    await ticket.save()
    new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
    })
    res.status(201).send(ticket)
})

export { router as createTicketRouter }
