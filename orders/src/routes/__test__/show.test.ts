import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/Ticket"
import { testSignUp } from "../../test/signUpHelper"

describe("Retrieving Order Tests", () => {
    let sessionCookie = [""]

    beforeAll(() => {
        sessionCookie = testSignUp({ email: "test@test.com" })
    })

    it("returns a 404 if the order is not found", async () => {
        const id = new mongoose.Types.ObjectId().toHexString()
        await request(app).get(`/api/orders/${id}`).send().expect(404)
    })

    it("returns an unauthorized error for another user", async () => {
        const ticket = Ticket.build({ title: "Concert", price: 20 })
        await ticket.save()

        const createOrderResponse = await request(app)
            .post("/api/orders")
            .set("Cookie", sessionCookie)
            .send({ ticketId: ticket.id })
            .expect(201)

        await request(app)
            .get(`/api/orders/${createOrderResponse.body.id}`)
            .set("Cookie", testSignUp({ email: "another@user.com", id: "different" }))
            .send()
            .expect(401)
    })

    it("returns the order is the order is found", async () => {
        const ticket = Ticket.build({ title: "Concert", price: 20 })
        await ticket.save()

        const createOrderResponse = await request(app)
            .post("/api/orders")
            .set("Cookie", sessionCookie)
            .send({ ticketId: ticket.id })
            .expect(201)

        const getOrderResponse = await request(app)
            .get(`/api/orders/${createOrderResponse.body.id}`)
            .set("Cookie", sessionCookie)
            .send()
            .expect(200)

        expect(getOrderResponse.body.id).toEqual(createOrderResponse.body.id)
        expect(getOrderResponse.body.ticket.id).toEqual(ticket.id)
    })
})
