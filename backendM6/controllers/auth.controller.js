import Author from '../models/authorSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    // verificare che la mail sia già utilizzata
    const author = await Author.findOne({email: req.body.email})
    if (author) {
        return res.status(500).send('Mail già nel database.') // la mail è già presente 
    }
    // se non è utilizzata allora registrare il nuovo utente con la password hashata
    const newAuthor = new Author ({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        birthDate: req.body.birthDate,
        avatar: req.body.avatar ? req.body.avatar : 'https://thumbs.dreamstime.com/z/disegno-vettoriale-immagine-profilo-avatar-vuoto-262683009.jpg?ct=jpeg',
        verifictedAct: new Date()
    })

    const createdAuthor = await newAuthor.save()
    res.send(createdAuthor)
}

export const login = async (req, res) => {
    const author = await Author.findOne({email: req.body.email}).select('+password') // la select mi consente di prendere il campo password
    if (!author) {
        return res.status(401).send('Credenziali errate.') // ricerca della mail non trovata
    }
    if (!(await bcrypt.compare(req.body.password, author.password))) {
        // ricerca della mail riuscita
        return res.status(401).send('Credenziali errate.')
    }

    // se la mail è corretta allora generiamo il jwt e lo stampiamo in risposta 
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

export const me = async (req, res) => {
    return res.send(req.loggedAuthor)
}