import request from "supertest"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"

describe("Ticket Creation Tests", () => {
    let sessionCookie = [""]

    beforeAll(async () => {
        sessionCookie = await testSignUp({ email: "test@test.com", password: "test123" })
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
        const response = await request(app)
            .post("/api/tickets")
            .set("Cookie", sessionCookie)
            .send({
                title: "hello",
                price: 10,
            })
            .expect(201)
    })
})
