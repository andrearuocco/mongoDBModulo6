import Author from '../models/authorSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    // verificare che la mail sia già utilizzata
    const author = await Author.findOne({email: req.body.email})
    if (author) {
        return res.status(500).send('Mail già nel database.')
    }
    // se non è utilizzata allora registrare il nuovo utente con la password hashata
    const newAuthor = new Author ({
        ...req.body,
        password: await bcrypt.hash(req.body.password, 10),
        verifictedAct: new Date(),
    })

    const createdAuthor = await newAuthor.save()
    res.send(createdAuthor)
}

export const login = async (req, res) => {
    const author = await Author.findOne({email: req.body.email})
    if (!author) {
        return res.status(401).send('Credenziali errate.')
    }
    if (!(await bcrypt.compare(req.body.password, author.password)))

    jwt.sign(
        { authorId: author.id },
        process.env.JWT_SECRET, {
            expiresIn: '1h'
        }, (err, jwtToken) => {
            if (err) return res.status(500).send()
            return res.send({
                token: jwtToken,
            })
        }
    )
}
export const logout = async (req, res) => {}
export const me = async (req, res) => {}