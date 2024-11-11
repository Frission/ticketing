import mongoose, { StringExpressionOperatorReturningNumber } from "mongoose"

interface TicketProps {
    title: string
    price: number
    userId: string
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(props: TicketProps): TicketDoc
}

interface TicketDoc extends mongoose.Document {
    title: string
    price: number
    userId: string

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
        },
        userId: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
            },
        },
    },
)

ticketSchema.statics.build = (props: TicketProps) => {
    return new Ticket(props)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema)

export { Ticket }
