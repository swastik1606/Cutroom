import validator from 'validator'
import bcrypt from 'bcrypt'
import { getDb } from '../sql/getDb.js'

export async function regUser(req, res) {
    let { name, email, password } = req.body
    const pattern = /^[a-zA-Z0-9]{1,20}$/
    const db = await getDb()

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Kindly fill all relevant fields to continue!" })
    }

    name = name.trim()

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email." })
    }

    if (!pattern.test(password)) {
        return res.status(400).json({ error: "Please ensure that you password and username are between 1 and 20 characters and only include aplhanumeric characters!" })
    }

    try {
        const isExisitng = await db.get(`select * from users where email=?`, [email])

        if (isExisitng) {
            return res.status(401).json({ error: "You are already registerd, kindly login!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await db.exec("BEGIN TRANSACTION")

        const result = await db.run(`insert into users(name, email, password) values(?, ?, ?)`, [name, email, hashedPassword])

        await db.exec("COMMIT")

        req.session.userId = result.lastID
        res.status(200).json({ message: "User registered!" })
    } catch (err) {
        console.log(err)
        await db.exec("ROLLBACK")
        res.status(400).json({ error: "There was an error while trying register the user!" })
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body
    const db = await getDb()

    if (!email || !password) {
        res.status(400).json({ error: "Please fill all required fields!" })
    }

    try {
        const user = await db.get(`select * from users where email=?`, [email])

        if (!user) {
            return res.status(400).json({ error: "This account does not exist, kindly register!" })
        }

        const isValidPass = await bcrypt.compare(password, user.password)

        if (!isValidPass) {
            return res.status(401).json({ error: "Invalid password!" })
        }

        req.session.userId = user.user_id
        res.status(200).json({ message: "User logged in!" })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: "There was an error while logging you in!" })
    }
}

export async function logoutUser(req, res) {
    console.log('user logged out!')
}