import express from 'express'
import { register, login, me } from '../controllers/auth.controller.js';
import authorization from '../middleware/authorization.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';


const authRouter = express.Router()

authRouter.post('/register', uploadCloudinary.single('avatar'), register)

authRouter.post('/login', login)

authRouter.get('/me', authorization, me )

/* authRouter.get('/login google', loginGoogle)

authRouter.get('/callback-google', callbackGoogle) // quella che chiama google passandoli i dati
 */
export default authRouter