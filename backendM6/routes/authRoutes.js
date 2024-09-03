import express from 'express'
import { register, login, me, callbackGoogle } from '../controllers/auth.controller.js';
import authorization from '../middleware/authorization.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';
import passport from 'passport';

const authRouter = express.Router()

authRouter.post('/register', uploadCloudinary.single('avatar'), register)

authRouter.post('/login', login)

authRouter.get('/me', authorization, me )

authRouter.get('/login-google', passport.authenticate('google', { scope: ['profile', 'email'] })) // questa rotta attraverso il rispettivo middleware ha lo scopo di ridirenzionarci alla pagina Google passando l'id e il segreto come identificazione

authRouter.get('/callback-google', 
    // questa rotta recupera l'utente dal DB o lo crea
    passport.authenticate('google', { session: false }), // genera il jwt con l'id dell'utente nel payload
    callbackGoogle) // ridirenziona alla stringa f-e passando il jwt come stringa all'url

export default authRouter