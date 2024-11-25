import mongoose from "mongoose"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"
import request from "supertest"
import { Ticket } from "../../models/Ticket"
import { OrderStatus } from "@frissionapps/common"
import { Order } from "../../models/Order"
import { natsWrapper } from "../../util/NatsWrapper"

const userId = "123"

describe("Order Creation Tests", () => {
    let sessionCookie = [""]

    beforeAll(() => {
        sessionCookie = testSignUp({ email: "test@test.com", id: userId })
    })

    it("has a route handler listening to /api/orders for post requests", async () => {
        const response = await request(app).post("/api/orders").send({})

        expect(response.status).not.toBe(404)
    })

    it("returns an error if the ticket does not exist", async () => {
        const ticketId = new mongoose.Types.ObjectId()

        await request(app).post("/api/orders").set("Cookie", sessionCookie).send({ ticketId }).expect(404)
    })

    it("returns an error if the ticket is already reserved", async () => {
        const ticket = Ticket.build({ title: "Concert", price: 20 })
        await ticket.save()

        const order = Order.build({ userId: userId, ticket, status: OrderStatus.Created, expiresAt: new Date() })
        await order.save()

        await request(app).post("/api/orders").set("Cookie", sessionCookie).send({ ticketId: ticket.id }).expect(400)
    })

    it("reserves a ticket successfully", async () => {
        const ticket = Ticket.build({ title: "Concert", price: 20 })
        await ticket.save()

        const orderResponse = await request(app)
            .post("/api/orders")
            .set("Cookie", sessionCookie)
            .send({ ticketId: ticket.id })
            .expect(201)

        expect(orderResponse.body.status).toEqual(OrderStatus.Created)
    })

    it("publishes an order created event", async () => {
        const ticket = Ticket.build({ title: "Concert", price: 20 })
        await ticket.save()

        await request(app).post("/api/orders").set("Cookie", sessionCookie).send({ ticketId: ticket.id }).expect(201)

        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })
})
