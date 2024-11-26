import request from "supertest"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"
import mongoose from "mongoose"
import { natsWrapper } from "../../util/NatsWrapper"
import { Ticket } from "../../models/Ticket"

describe("Ticket Updating tests", () => {
    let sessionCookie = [""]

    beforeAll(() => {
        sessionCookie = testSignUp({ email: "test@test.com" })
    })

    it("returns a 404 if the provided id does not exist", async () => {
        const id = new mongoose.Types.ObjectId().toHexString()
        await request(app)
            .put(`/api/tickets/${id}`)
            .set("Cookie", sessionCookie)
            .send({ title: "updated", price: 20 })
            .expect(404)
    })

    it("returns a 401 if the user is not authenticated", async () => {
        const id = new mongoose.Types.ObjectId().toHexString()
        await request(app).put(`/api/tickets/${id}`).send({ title: "updated", price: 20 }).expect(401)
    })

    it("returns a 401 if the user does not own the ticket", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 10,
            })
            .expect(201)

        const id = response.body.id
        const anotherUserCookie = testSignUp({ email: "test@test.com", id: "456" })

        await request(app)
            .put(`/api/tickets/${id}`)
            .set("Cookie", anotherUserCookie)
            .send({ title: "updated", price: 20 })
            .expect(401)
    })

    it("returns a 400 if the user provides an invalid title or price", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 10,
            })
            .expect(201)

        const id = response.body.id

        await request(app)
            .put(`/api/tickets/${id}`)
            .set("Cookie", sessionCookie)
            .send({ title: "", price: 20 })
            .expect(400)

        await request(app)
            .put(`/api/tickets/${id}`)
            .set("Cookie", sessionCookie)
            .send({ title: "updatee", price: -2 })
            .expect(400)

        await request(app).put(`/api/tickets/${id}`).set("Cookie", sessionCookie).send({ price: 200 }).expect(400)

        await request(app).put(`/api/tickets/${id}`).set("Cookie", sessionCookie).send({ title: "updated" }).expect(400)
    })

    it("successfully updates the ticket for the correct user with valid inputs", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 10,
            })
            .expect(201)

        const id = response.body.id

        const updateResponse = await request(app)
            .put(`/api/tickets/${id}`)
            .set("Cookie", sessionCookie)
            .send({ title: "updated", price: 20 })
            .expect(200)

        expect(updateResponse.body.title).toEqual("updated")
        expect(updateResponse.body.price).toEqual(20)
    })

    it("rejects updates if the ticket is reserved", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 10,
            })
            .expect(201)

        const id = response.body.id
        const ticket = await Ticket.findById(id)

        ticket!.set({ orderId: "abc" })
        await ticket!.save()

        await request(app)
            .put(`/api/tickets/${id}`)
            .set("Cookie", sessionCookie)
            .send({ title: "updated", price: 20 })
            .expect(400)
    })

    it("publishes an event", async () => {
        const response = await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 10,
            })
            .expect(201)

        const id = response.body.id

        await request(app)
            .put(`/api/tickets/${id}`)
            .set("Cookie", sessionCookie)
            .send({ title: "updated", price: 20 })
            .expect(200)

        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })
})
