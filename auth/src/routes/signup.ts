import express, { Request, Response } from "express"
import { body } from "express-validator"
import jwt from "jsonwebtoken"
import { BadRequestError } from "../errors/BadRequestError"
import { validateRequest } from "../middlewares/validateRequest"
import { User } from "../models/User"

const router = express.Router()

const middlewares = [
    body("email").isString().isEmail().isLength({ min: 3, max: 250 }).withMessage("E-mail must be valid"),
    body("password")
        .isString()
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
        validateRequest
]

router.post("/api/users/signup", middlewares, async (req: Request, res: Response) => {
    console.log("Creating a user...")

    const { email, password } = req.body

    if (await User.exists({ email })) {
        throw new BadRequestError("Email is already in use")
    }

    const user = User.build({ email, password })
    await user.save()

    // Generate JWT
    const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!)

    req.session = { jwt: userJwt }

    res.status(201).send(user)
})

export { router as signUpRouter }
