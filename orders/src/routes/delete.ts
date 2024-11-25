import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "@frissionapps/common"
import express, { Request, Response } from "express"
import { Order } from "../models/Order"
import { OrderCancelledPublisher } from "../events/publishers/OrderCancelledPublisher"
import { natsWrapper } from "../util/NatsWrapper"

const router = express.Router()

router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    const orderId = req.params.orderId

    if (orderId == null) {
        throw new BadRequestError("No id was found inside the request")
    }

    let order
    try {
        order = await Order.findById(orderId).populate("ticket")
    } catch (err) {
        console.error(err)
        throw new BadRequestError("Please provide a valid id")
    }

    if (order?.userId != req.currentUser?.id) throw new NotAuthorizedError()
    if (order == null) throw new NotFoundError()

    order.status = OrderStatus.Cancelled
    await order.save()

    // Fire an order cancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
        userId: req.currentUser!.id,
        id: order.id,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price,
        },
    })

    res.status(204).send(order)
})

export { router as deleteOrderRouter }
