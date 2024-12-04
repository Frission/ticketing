import mongoose from "mongoose"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"
import request from "supertest"
import { Order } from "../../models/Order"
import { OrderStatus } from "@frissionapps/common"

const userId = "123"

describe("Order Creation Tests", () => {
    let sessionCookie = [""]

    beforeAll(() => {
        sessionCookie = testSignUp({ email: "test@test.com", id: userId })
    })

    it("returns a 404 when purchasing an order that does not exist", async () => {
        await request(app)
            .post("/api/payments")
            .set("Cookie", sessionCookie)
            .send({
                token: "randomtoken",
                orderId: new mongoose.Types.ObjectId().toHexString(),
            })
            .expect(404)
    })

    it("returns a 401 when purchasing an order that doesn't belong to the user", async () => {
        const order = Order.build({
            _id: new mongoose.Types.ObjectId().toHexString(),
            status: OrderStatus.AwaitingPayment,
            version: 0,
            price: 20,
            userId: "456",
        })
        await order.save()

        await request(app)
            .post("/api/payments")
            .set("Cookie", sessionCookie)
            .send({
                token: "randomtoken",
                orderId: order.id,
            })
            .expect(401)
    })

    it("returns a 400 when purchasing a cancelled order", async () => {
        const order = Order.build({
            _id: new mongoose.Types.ObjectId().toHexString(),
            status: OrderStatus.Cancelled,
            version: 0,
            price: 20,
            userId,
        })
        await order.save()

        await request(app)
            .post("/api/payments")
            .set("Cookie", sessionCookie)
            .send({
                token: "randomtoken",
                orderId: order.id,
            })
            .expect(400)
    })
})
