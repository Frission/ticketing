import express, { Request, Response } from "express"
import { body } from "express-validator"
import { validateRequest } from "../middlewares/validateRequest"
import { User } from "../models/User"
import { BadRequestError } from "../errors/BadRequestError"
import { PasswordUtils } from "../util/PasswordUtils"
import jwt from "jsonwebtoken"

const router = express.Router()

const middlewares = [
    body("email").isString().isEmail().isLength({ min: 3, max: 250 }).withMessage("E-mail must be valid"),
    body("password").isString().trim().notEmpty().withMessage("You must provide a password"),
    validateRequest,
]

router.get("/api/users/signin", middlewares, async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser == null) {
        throw new BadRequestError("E-mail or password was incorrect")
    }

    const passwordCorrect = await PasswordUtils.compare(existingUser.password, password)
    if (!passwordCorrect) {
        throw new BadRequestError("E-mail or password was incorrect")
    }

    // Generate JWT
    const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!)

    req.session = { jwt: userJwt }

    res.send(existingUser)
})

export { router as signInRouter }
