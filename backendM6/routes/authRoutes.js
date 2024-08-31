import express from 'express'
import { register, login, me } from '../controllers/auth.controller.js';
import authorization from '../middleware/authorization.js';

const authRouter = express.Router()

authRouter.post('/register', register)

authRouter.post('/login', login)

authRouter.get('/me', authorization, me )

export default authRouter