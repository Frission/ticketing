import mongoose from "mongoose"
import { Order } from "./Order"
import { OrderStatus } from "@frissionapps/common"

interface TicketProps {
    _id?: string
    title: string
    price: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(props: TicketProps): TicketDoc
}

export interface TicketDoc extends Omit<mongoose.Document, "__v"> {
    title: string
    price: number
    version: number
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
        optimisticConcurrency: true,
        versionKey: "version",
    },
)

ticketSchema.statics.build = (props: TicketProps) => {
    return new Ticket(props)
}

ticketSchema.methods.isReserved = async function () {
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
