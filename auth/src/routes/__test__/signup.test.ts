import request from "supertest"
import { app } from "../../app"

describe("Signup Tests", () => {
    it("should be able to sign up successfully", async () => {
        return await request(app)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "test123",
            })
            .expect(201)
    })

    it("returns a 400 with an invalid e-mail", async () => {
        return await request(app)
            .post("/api/users/signup")
            .send({
                email: "test@",
                password: "test123",
            })
            .expect(400)
    })

    it("returns a 400 with an invalid password", async () => {
        return await request(app)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "te",
            })
            .expect(400)
    })

    it("returns a 400 with missing e-mail and password", async () => {
        await request(app).post("/api/users/signup").send({ email: "test@test.com" }).expect(400)
        return await request(app).post("/api/users/signup").send({ password: "test123" }).expect(400)
    })

    it("should not be able to sign up with a duplicate e-mail", async () => {
        await request(app)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "test123",
            })
            .expect(201)

        return await request(app)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "test123",
            })
            .expect(400)
    })

    it("sets a cookie after a successfull sign up", async () => {
        const response = await request(app)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "test123",
            })
            .expect(201)

        expect(response.get("Set-Cookie")).toBeDefined()
    })
})
