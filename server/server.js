import express from 'express'
import session from 'express-session'
import dotenv from 'dotenv'
import cors from 'cors'
import { authRouter } from './routes/authRouter.js'
import { meRouter } from './routes/meRouter.js'
import { apiRouter } from './routes/apiRouter.js'

dotenv.config()

const app = express()
const PORT = 8000
const secret = process.env.SESSION_SECRET

app.use(cors())
app.use(express.json())
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use('/auth/me', meRouter)
app.use('/auth', authRouter)
app.use('/api', apiRouter)

app.listen(PORT, ()=>console.log(`listening on port ${PORT}`))