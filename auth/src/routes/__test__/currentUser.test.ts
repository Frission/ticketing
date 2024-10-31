import request from "supertest"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"

describe("Current User Tests", () => {
    it("should receive current user successfully", async () => {
        const response = await testSignUp()

        const currentUserResponse = await request(app)
            .get("/api/users/currentuser")
            .set("Cookie", response.get("Set-Cookie")!)
            .send()
            .expect(200)

        expect(currentUserResponse.body.currentUser.email).toEqual("test@test.com")
    })

    it("should receive null if not authenticated", async () => {
        const currentUserResponse = await request(app)
            .get("/api/users/currentuser")
            .send()
            .expect(200)

        expect(currentUserResponse.body.currentUser).toEqual(null)
    })
})
