import express from 'express'
import { loginUser, logoutUser, regUser } from '../controllers/authController.js'

export const authRouter = express.Router()

authRouter.post('/register', regUser)
authRouter.post('/login', loginUser)
authRouter.get('/logout', logoutUser)