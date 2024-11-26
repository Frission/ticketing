import express, { Request, Response } from "express"
import { Ticket } from "../models/Ticket"
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@frissionapps/common"
import { body } from "express-validator"
import { TicketUpdatedPublisher } from "../events/publishers/TicketUpdatedPublisher"
import { natsWrapper } from "../util/NatsWrapper"

const router = express.Router()

const updateTicketMiddlewares = [
    requireAuth,
    body("title").isString().notEmpty().withMessage("Please provide a title"),
    body("price")
        .notEmpty()
        .withMessage("Please provide a price")
        .isFloat({ gt: 0, max: 999999 })
        .withMessage("Please provide a valid price"),
    validateRequest,
]

router.put("/api/tickets/:id", updateTicketMiddlewares, async (req: Request, res: Response) => {
    const ticketId = req.params.id

    if (ticketId == null) {
        throw new BadRequestError("No id was found inside the request")
    }

    let ticket
    try {
        ticket = await Ticket.findById(ticketId)
    } catch (err) {
        console.error(err)
        throw new BadRequestError("Please provide a valid id")
    }

    if (ticket == null) {
        throw new NotFoundError()
    }

    if(ticket.orderId != null) {
        throw new BadRequestError("This ticket is currently reserved")
    }

    if (ticket.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError()
    }

    ticket.set({ title: req.body.title, price: req.body.price })
    await ticket.save()
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
    })

    res.send(ticket)
})

export { router as updateicketRouter }
