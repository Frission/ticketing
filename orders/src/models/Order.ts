import { OrderStatus } from "@frissionapps/common"
import mongoose from "mongoose"
import { TicketDoc } from "./Ticket"

interface OrderProps {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(props: OrderProps): OrderDoc
}

interface OrderDoc extends Omit<mongoose.Document, "__v"> {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
    version: number
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
            required: true,
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
        },
    },
    {
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
            },
        },
        optimisticConcurrency: true,
        versionKey: "version",
    },
)

orderSchema.statics.build = (props: OrderProps) => {
    return new Order(props)
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)

export { Order }
