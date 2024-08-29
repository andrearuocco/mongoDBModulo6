import express from 'express'
import { register, login, logout, me } from '../controllers/user.controller.js';


const userRouter = express.Router()

userRouter.post('/register', register)

userRouter.post('/login', login)

userRouter.post('/logout', logout)

userRouter.get('/me', me )

export default userRouter