import validator from 'validator'
import { getDb } from '../sql/getDb.js'

export async function createClient(req, res) {
    let { name, phone, email, notes, company, currency } = req.body
    const db = await getDb()

    name = name.trim()

    if (!name, !email, !currency) {
        return res.status(400).json({ error: "Please ensure that you've filled all required fields!" })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Please enter a valid email!" })
    }

    if (!validator.isMobilePhone(phone, 'any')) {
        return res.status(400).json({ error: "Please enter a valid phone number!" })
    }

    const isExisitng = await db.get(`select * from clients where email=? and phone=?`, [email, phone])
    if (isExisitng) {
        return res.status(400).json({ error: "Client with this phone number or email already exists!" })
    }

    try {
        const user = await db.get(`select * from users where user_id=?`, [req.session.user_id])

        if (!user) {
            return res.status(400).json({ error: "You need to be logged in to add a new client!" })
        }

        await db.exec('BEGIN TRANSACTION')

        await db.run(`insert into clients(name, phone, email, notes, company, currency) values(?,?,?,?,?,?)`, [name, phone, email, notes, company, currency])

        await db.exec('COMMIT')
        res.status(200).json({ message: "Client created!" })

    } catch (err) {
        console.log(err)
        await db.exec("ROLLBACK")
        res.status(400).json({ error: "There was an error while creating a new client" })
    }
}

export async function editClient() {
    console.log('client deleted!')
}

export async function deleteClient() {
    console.log('client deleted!')
}