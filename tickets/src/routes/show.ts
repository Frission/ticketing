import { BadRequestError, NotFoundError } from "@frissionapps/common"
import express, { Request, Response } from "express"
import { Ticket } from "../models/Ticket"

const router = express.Router()

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
    const ticketId = req.params.id

    if (ticketId == null) {
        throw new BadRequestError("No id was found inside the request")
    }

    let ticket
    try {
        ticket = await Ticket.findById(ticketId)
    } catch (err) {
        console.error(err)
        throw new BadRequestError("Please provide a valid id")
    }

    if (ticket != null) {
        res.send(ticket)
    } else {
        throw new NotFoundError()
    }
})

export { router as showTicketRouter }
