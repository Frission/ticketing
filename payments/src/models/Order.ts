import { OrderStatus } from "@frissionapps/common"
import mongoose from "mongoose"

interface OrderProps {
    _id?: string
    userId: string
    status: OrderStatus
    price: number
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(props: OrderProps): OrderDoc
    findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>
}

interface OrderDoc extends Omit<mongoose.Document, "__v"> {
    userId: string
    status: OrderStatus
    price: number
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
        },
        price: {
            type: Number,
            required: true,
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

orderSchema.statics.findByEvent = async (event: { id: string; version: number }) => {
    return await Order.findOne({ _id: event.id, version: event.version - 1 })
}


const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)

export { Order }
