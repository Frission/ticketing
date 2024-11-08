import request from "supertest"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"
import { Ticket } from "../../models/Ticket"
import mongoose from "mongoose"

describe("Retrieving Ticket Tests", () => {
    let sessionCookie = [""]

    beforeAll(() => {
        sessionCookie = testSignUp({ email: "test@test.com" })
    })

    it("returns a 404 if the ticket is not found", async () => {
        const id = new mongoose.Types.ObjectId().toHexString()
        await request(app).get(`/api/tickets/${id}`).send().expect(404)
    })

    it("returns the ticket is the ticket is found", async () => {
        await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 10,
            })
            .expect(201)

        let tickets = await Ticket.find({})
        expect(tickets.length).toEqual(1)

        await request(app).get(`/api/tickets/${tickets[0]._id}`).send().expect(200)
    })
})
