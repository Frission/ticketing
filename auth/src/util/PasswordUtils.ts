import { scrypt, randomBytes } from "crypto"
import { promisify } from "util"

const scryptAsync = promisify(scrypt)

export class PasswordUtils {
    static async toHash(password: string): Promise<string> {
        const salt = randomBytes(8).toString("hex")
        const buffer = (await scryptAsync(salt, password, 64)) as Buffer
        return `${buffer.toString("hex")}.${salt}`
    }

    static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
        const [hashedPassword, salt] = storedPassword.split(".")
        const buffer = (await scryptAsync(salt, hashedPassword, 64)) as Buffer
        return buffer.toString("hex") === hashedPassword
    }
}
