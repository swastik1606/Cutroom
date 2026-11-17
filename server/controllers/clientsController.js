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
        const user = await db.get(`select * from users where user_id=?`, [req.session.user_id || 1])

        if (!user) {
            return res.status(400).json({ error: "You need to be logged in to add a new client!" })
        }

        await db.exec('BEGIN TRANSACTION')

        await db.run(`insert into clients(name, phone, email, notes, company, currency, user_id) values(?,?,?,?,?,?,?)`, [name, phone, email, notes, company, currency, user.user_id])

        await db.exec('COMMIT')
        res.status(200).json({ message: "Client created!" })

    } catch (err) {
        console.log(err)
        await db.exec("ROLLBACK")
        res.status(400).json({ error: "There was an error while creating a new client" })
    }
}

export async function editClient(req, res) {
    let { name, phone, email, currency } = req.body
    const db = await getDb()
    const clientId= req.params.id

    const user = await db.get(`select * from users where user_id=?`, [req.session.user_id || 1])
    if (!user) {
        return res.status(400).json({ error: "Please sign in to edit clients!" })
    }

    try {
        console.log(email,phone)
        const client = await db.get(`select * from clients where client_id=?`, [clientId])
        if (!client) {
            return res.status(404).json({ error: "This client does not exist!" })
        }

        if (client.user_id != user.user_id) {
            return res.status(400).json({ error: "You are not authorized to edit this client!" })
        }

        name = name.trim()

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Please enter a valid email!" })
        }

        if (!validator.isMobilePhone(phone, 'any')) {
            return res.status(400).json({ error: "Please enter a valid phone number!" })
        }

        await db.exec("BEGIN TRANSACTION")

        await db.run(`update clients set phone=?, email=?, name=?, currency=? where client_id=?`, [phone, email, name, currency, client.client_id])

        await db.exec("COMMIT")
        return res.status(200).json({ message: "Client updated!" })
    } catch (err) {
        console.log(err)
        await db.exec("ROLLBACK")
        return res.status(400).json({ error: "There was an error while trying to edit your client!" })
    }
}

export async function deleteClient() {
    console.log('client deleted!')
}