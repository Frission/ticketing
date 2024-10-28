import express, { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { RequestValidationError } from "../errors/RequestValidationError"
import { DatabaseConnectionError } from "../errors/DatabaseConnectionError"

const router = express.Router()

const validators = [
    body("email").isString().isEmail().isLength({ min: 3, max: 250 }).withMessage("E-mail must be valid"),
    body("password")
        .isString()
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
]

router.get("/api/users/signup", validators, (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }

    const { email, password } = req.body

    console.log("Creating a user...")

    throw new DatabaseConnectionError()

    res.send({})
})

export { router as signUpRouter }
