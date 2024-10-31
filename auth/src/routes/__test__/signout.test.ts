import request from "supertest"
import { app } from "../../app"
import { testSignUp } from "../../test/signUpHelper"

describe("Sign Out Tests", () => {
    it("should be able to sign out", async () => {
        // sign up first to have an account
        await testSignUp()

        const signOutResponse = await request(app).get("/api/users/signout").send({}).expect(200)

        expect(signOutResponse.get("Set-Cookie")?.[0]).toEqual(
            "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
        )
    })
})
