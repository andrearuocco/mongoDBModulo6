import {model, Schema} from 'mongoose'

const commentsSchema = new Schema(
    {
        content: {
            type: String,
            minLength: 3,
            maxLength: 5000,
            required: true,
            trim: true, // elimina spazi bianchi all'inizio e alla fine del testo inserito in modo da non appesantire il database con caratteri inutili
        },
        blogpost: {
            type: Schema.Types.ObjectId,
            ref: 'blogPost',
        },
    },
    {
        collection: "comments",
        timestamps: true,
    }
)

export default model("Comment", commentsSchema)