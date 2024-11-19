import request from "supertest"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"
import { Ticket } from "../../models/Ticket"
import { natsWrapper } from "../../util/NatsWrapper"

describe("Ticket Creation Tests", () => {
    let sessionCookie = [""]

    beforeAll(() => {
        sessionCookie = testSignUp({ email: "test@test.com" })
    })

    it("has a route handler listening to /api/tickets for post requests", async () => {
        const response = await request(app).post("/api/tickets").send({})

        expect(response.status).not.toBe(404)
    })

    it("can only be accessed when signed in", async () => {
        await request(app).post("/api/tickets").send({}).expect(401)
    })

    it("returns a status other than 401 if the user is signed in", async () => {
        const response = await request(app).post("/api/tickets").set("Cookie", sessionCookie).send({})

        expect(response.status).not.toBe(401)
    })

    it("returns an error if an invalid title is provided", async () => {
        await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "",
                price: 10,
            })
            .expect(400)
    })

    it("returns an error if an invalid price is provided", async () => {
        await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 0,
            })
            .expect(400)
    })

    it("successfully creates a ticket with valid parameters", async () => {
        let tickets = await Ticket.find({})
        expect(tickets.length).toEqual(0)

        await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 10,
            })
            .expect(201)

        tickets = await Ticket.find({})
        expect(tickets.length).toEqual(1)
        expect(tickets[0].title).toEqual("hello")
        expect(tickets[0].price).toEqual(10)
    })

    it("publishes an event", async () => {
        await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 10,
            })
            .expect(201)

        expect(natsWrapper.client.publish).toHaveBeenCalled()
    })
})
