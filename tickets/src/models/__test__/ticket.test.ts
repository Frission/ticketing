import { Ticket } from "../Ticket"

describe("Ticket model tests", () => {
    it("implements optimistic concurrency control", async () => {
        const ticket = Ticket.build({ title: "Ticket", price: 20, userId: "123" })
        await ticket.save()

        const first = await Ticket.findById(ticket.id)
        const second = await Ticket.findById(ticket.id)

        first!.price = 15
        await first!.save()

        second!.price = 25
        try {
            await second!.save()
        } catch (err) {
            return // optimistic concurrency did work
        }

        throw new Error("Optimistic concurrency did not work")
    })

    it("increments the version number on multiple saves", async () => {
        const ticket = Ticket.build({ title: "Ticket", price: 20, userId: "123" })
        await ticket.save()
        expect(ticket.version).toEqual(0)

        ticket.price = 15
        await ticket.save()
        expect(ticket.version).toEqual(1)

        ticket.price = 25
        await ticket.save()
        expect(ticket.version).toEqual(2)
    })
})
