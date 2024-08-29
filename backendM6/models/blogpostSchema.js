import { model, Schema, set } from 'mongoose'
set("strictQuery", true); //  assicura che i valori passati al nostro costruttore di modelli che non sono stati specificati nel nostro schema non vengano salvati nel database

const tagSchema = new Schema({
    name: String,
})

const blogpostSchema = new Schema ({
    category: {
        type: String, 
        required: true,
        enum: ["Category1", "Category2", "Category3", "Category4", "Category5"],
    },
    title: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 300,
    },
    cover: {
        type: String, 
    },
    readTime: {
        value: {
            type: Number,
        },
        unit: {
            type: String,
        }
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'Author',
    },
    content: {
        type: String,
        required: true,
    },
    tags: [tagSchema],
}, { collection: 'blogpost' })

export default model('blogPost', blogpostSchema)