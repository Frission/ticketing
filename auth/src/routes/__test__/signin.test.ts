import request from "supertest"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"

describe("Sign In Tests", () => {
    it("fails when an email that has not signed up is provided", async () => {
        return await request(app)
            .post("/api/users/signin")
            .send({
                email: "notsignedup@test.com",
                password: "plsletmein123",
            })
            .expect(400)
    })

    it("fails when an incorrect password is provided", async () => {
        // sign up first to have an account
        await testSignUp({
            email: "test@test.com",
            password: "test123",
        })

        return await request(app)
            .post("/api/users/signin")
            .send({
                email: "test@test.com",
                password: "test1234",
            })
            .expect(400)
    })

    it("successfully signs in with correct credentials", async () => {
        // sign up first to have an account
        await testSignUp({
            email: "test@test.com",
            password: "test123",
        })

        const response = await request(app)
            .post("/api/users/signin")
            .send({
                email: "test@test.com",
                password: "test123",
            })
            .expect(200)

        expect(response.get("Set-Cookie")).toBeDefined()
    })
})
