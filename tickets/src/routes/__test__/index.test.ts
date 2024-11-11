import request from "supertest"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"

describe("Get All Tickets Tests", () => {
    let sessionCookie = [""]

    beforeAll(() => {
        sessionCookie = testSignUp({ email: "test@test.com" })
    })

    const createTicket = async (title: string) => {
        await request(app).post("/api/tickets").set("Cookie", sessionCookie).send({
            title,
            price: 10,
        })
    }

    it("should be able to retrieve all tickets", async () => {
        await createTicket("hello")
        await createTicket("world")
        await createTicket("tickets")

        const response = await request(app).get("/api/tickets").send().expect(200)

        expect(response.body).toHaveProperty("length")
        expect(response.body.length).toBe(3)
    })
})
