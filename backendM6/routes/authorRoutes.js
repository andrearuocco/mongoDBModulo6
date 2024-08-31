import express from 'express'
import { addAuthor, getAllAuthor, getSingleAuthor, editAuthor, deleteAuthor, patchAuthor } from '../controllers/author.controller.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';

const authorRouter = express.Router()

authorRouter.post('/', addAuthor)

authorRouter.get('/', getAllAuthor)

authorRouter.get('/:id', getSingleAuthor)

authorRouter.put('/:id', editAuthor)

authorRouter.delete('/:id', deleteAuthor )

authorRouter.patch('/:authorId/avatar', uploadCloudinary.single('avatar'), patchAuthor) 

// userRouter.post('/register', register)

export default authorRouter