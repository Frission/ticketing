import { Ticket } from "../../models/Ticket"
import request from "supertest"
import { testSignUp } from "../../test/signUpHelper"
import { OrderStatus } from "@frissionapps/common"
import { app } from "../../app"
import { Order } from "../../models/Order"

describe("Delete Order Tests", () => {
    let sessionCookie = [""]

    beforeAll(() => {
        sessionCookie = testSignUp({ email: "test@test.com" })
    })

    it("marks an order as cancelled", async () => {
        const ticket = Ticket.build({ title: "Concert", price: 20 })
        await ticket.save()

        const orderResponse = await request(app)
            .post("/api/orders")
            .set("Cookie", sessionCookie)
            .send({ ticketId: ticket.id })
            .expect(201)

        expect(orderResponse.body.status).toEqual(OrderStatus.Created)

        await request(app)
            .delete(`/api/orders/${orderResponse.body.id}`)
            .set("Cookie", sessionCookie)
            .send()
            .expect(204)

        const deletedOrder = await Order.findById(orderResponse.body.id)

        expect(deletedOrder?.status).toEqual(OrderStatus.Cancelled)
    })
})
