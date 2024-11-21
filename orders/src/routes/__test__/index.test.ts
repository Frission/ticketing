import request from "supertest"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"
import { Ticket } from "../../models/Ticket"
import { OrderStatus } from "@frissionapps/common"

const userId = "456"

describe("Get All Orders Tests", () => {
    let sessionCookie = [""]

    beforeAll(() => {
        sessionCookie = testSignUp({ email: "test@test.com", id: userId })
    })

    const createOrder = async (ticketTitle: string) => {
        const ticket = Ticket.build({ title: ticketTitle, price: 20 })
        await ticket.save()
        await request(app).post("/api/orders").set("Cookie", sessionCookie).send({ ticketId: ticket.id })
    }

    it("should be able to retrieve all tickets", async () => {
        await createOrder("Concert")
        await createOrder("Match")

        const response = await request(app).get("/api/orders").set("Cookie", sessionCookie).send().expect(200)

        expect(response.body).toHaveProperty("length")
        expect(response.body.length).toBe(2)
        expect(response.body[0].userId).toEqual(userId)
        expect(response.body[0].status).toEqual(OrderStatus.Created)
        expect(response.body[0].ticket.title).toEqual("Concert")
        expect(response.body[1].userId).toEqual(userId)
        expect(response.body[1].status).toEqual(OrderStatus.Created)
        expect(response.body[1].ticket.title).toEqual("Match")

        const anotherUserResponse = await request(app).get("/api/orders").set("Cookie", testSignUp({ email: "another@user.com" })).send().expect(200)

        expect(anotherUserResponse.body).toHaveProperty("length")
        expect(anotherUserResponse.body.length).toBe(0)
    })
})
