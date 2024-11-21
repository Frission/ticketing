import mongoose from "mongoose"
import { Order } from "./Order"
import { OrderStatus } from "@frissionapps/common"

interface TicketProps {
    title: string
    price: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(props: TicketProps): TicketDoc
}

export interface TicketDoc extends mongoose.Document {
    title: string
    price: number
    isReserved(): Promise<boolean>
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
            },
        },
    },
)

ticketSchema.statics.build = (props: TicketProps) => {
    return new Ticket(props)
}

ticketSchema.statics.isReserved = async function() {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
        },
    })

    return existingOrder != null
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export { Ticket }
