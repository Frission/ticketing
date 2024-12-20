import mongoose from "mongoose"

interface TicketProps {
    title: string
    price: number
    userId: string
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(props: TicketProps): TicketDoc
}

interface TicketDoc extends Omit<mongoose.Document, "__v"> {
    title: string
    price: number
    userId: string
    version: number
    orderId?: string
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
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String
        }
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

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export { Ticket }
