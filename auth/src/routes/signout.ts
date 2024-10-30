import express from "express"

const router = express.Router()

router.get("/api/users/signout", (req, res) => {
    req.session = null
    res.send({ status: "OK" })
})

export { router as signOutRouter }
