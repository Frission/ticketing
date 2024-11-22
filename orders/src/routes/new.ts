import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@frissionapps/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"
import mongoose from "mongoose"
import { Ticket } from "../models/Ticket"
import { Order } from "../models/Order"
import { OrderCreatedPublisher } from "../events/publishers/OrderCreatedPublisher"
import { natsWrapper } from "../util/NatsWrapper"

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60 // 15 Minutes

const middlewares = [
    requireAuth,
    body("ticketId")
        .not()
        .isEmpty()
        .withMessage("Ticket ID must be provided")
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage("Ticket ID must be valid"),
    validateRequest,
]

router.post("/api/orders", middlewares, async (req: Request, res: Response) => {
    // Find the ticket the user is trying to order
    const ticket = await Ticket.findById(req.body.ticketId)

    if (ticket == null) throw new NotFoundError()
    if (await ticket.isReserved()) throw new BadRequestError("This ticket is currently reserved.")

    // Calculate an expiration date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build the order and save it to the database
    const order = Order.build({
        userId: req.currentUser!.id,
        ticket: ticket,
        status: OrderStatus.Created,
        expiresAt: expiration,
    })
    await order.save()

    // Fire an order created event
    new OrderCreatedPublisher(natsWrapper.client).publish({
        userId: req.currentUser!.id,
        id: order.id,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price,
        },
    })

    res.status(201).send(order)
})

export { router as createOrderRouter }
