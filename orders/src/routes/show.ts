import express, { Request, Response } from "express"
import { Order } from "../models/Order"
import { BadRequestError, NotAuthorizedError, NotFoundError } from "@frissionapps/common"

const router = express.Router()

router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
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

    if(order?.userId != req.currentUser?.id) {
        throw new NotAuthorizedError()
    }

    if (order != null) {
        res.send(order)
    } else {
        throw new NotFoundError()
    }
})

export { router as showOrderRouter }
