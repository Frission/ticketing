import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
} from "@frissionapps/common"
import express, { Request, Response } from "express"
import { body } from "express-validator"
import { Order } from "../models/Order"
import { stripe } from "../stripe"

const router = express.Router()

const createPaymentMiddlewares = [
    requireAuth,
    body("token").isString().notEmpty().withMessage("Stripe token not found"),
    body("orderId").notEmpty().withMessage("Order Id not found"),
    validateRequest,
]

router.post("/api/payments", createPaymentMiddlewares, async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (order == null) throw new NotFoundError()
    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError()
    if (order.status == OrderStatus.Cancelled) throw new BadRequestError("This order was cancelled")

    await stripe.charges.create({
        amount: order.price * 100,
        currency: "usd",
        source: token
    })

    res.status(201).send({ success: true })
})

export { router as createChargeRouter }
