import GoogleStrategy from 'passport-google-oauth20';
import Author from '../models/authorSchema.js' 
import jwt from 'jsonwebtoken'

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.GOOGLE_CALLBACK}`,
    },

    async function (accessToken, refreshToken, profile, passportNext) {
        console.log(profile)

        const {
            given_name: firstName,
            family_name: lastName,
            email,
            sub: googleId,
        } = profile._json;

        // nel DB cerchiamo l'esistenza dell'utente
        let author = await Author.findOne({ googleId })

        // se non c'è lo creiamo
        if (!author) {
            const newAuthor = new Author({
                googleId,
                firstName,
                lastName,
                email
            })

            author = await newAuthor.save()
        }

        // creiamo il jwt per l'utente
        jwt.sign(
            { authorId: author.id },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            },
            (err, jwtToken) => {
                if (err) return res.status(500).send()

                // chiamiamo il prossimo middleware di passport in questo caso e non quello di express
                return passportNext(null, { jwtToken }) // il primo argomento è l'eventuale errore mentre il secondo è un oggetto con la chiave jwtToken che il middleware chiamato assegnerà a req.author
            }
        )
    }
)

export default googleStrategy