import { model, Schema } from 'mongoose'

const authorSchema = new Schema ({
    name: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 20,   
    },
    surname: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 20,   
    },
    email: {
        type: String, 
        required: [true, "Please enter an email"],
        lowercase: true, // converte in minuscolo
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date, 
    },
    avatar: {
        type: String, 
    },
    verifiedAt: Date,
    verificationCode: String,
}, { collection: 'authors', timestamps: true, })

export default model('Author', authorSchema)