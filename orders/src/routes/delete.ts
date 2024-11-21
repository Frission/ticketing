import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "@frissionapps/common"
import express, { Request, Response } from "express"
import { Order } from "../models/Order"

const router = express.Router()

router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    const orderId = req.params.orderId

    if (orderId == null) {
        throw new BadRequestError("No id was found inside the request")
    }

    let order
    try {
        order = await Order.findById(orderId)
    } catch (err) {
        console.error(err)
        throw new BadRequestError("Please provide a valid id")
    }

    if (order?.userId != req.currentUser?.id) throw new NotAuthorizedError()
    if (order == null) throw new NotFoundError()

    order.status = OrderStatus.Cancelled
    await order.save()

    res.status(204).send(order)
})

export { router as deleteOrderRouter }
