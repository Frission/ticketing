import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { BadRequestError } from "../errors/BadRequestError"
import { RequestValidationError } from "../errors/RequestValidationError"
import { User } from "../models/User"

const router = express.Router()

const validators = [
    body("email").isString().isEmail().isLength({ min: 3, max: 250 }).withMessage("E-mail must be valid"),
    body("password")
        .isString()
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
]

router.post("/api/users/signup", validators, async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }
    console.log("Creating a user...")

    const { email, password } = req.body

    if (await User.exists({ email })) {
        throw new BadRequestError("Email is already in use")
    }

    const user = User.build({ email, password })
    await user.save()

    res.status(201).send(user)
})

export { router as signUpRouter }
