import express from 'express'
import { addAuthor, getAllAuthor, getSingleAuthor, editAuthor, deleteAuthor, patchAuthor, getAuthorPosts } from '../controllers/author.controller.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';

const authorRouter = express.Router()


authorRouter.post('/', addAuthor)

authorRouter.get('/', getAllAuthor)

authorRouter.get('/:id', getSingleAuthor)

authorRouter.put('/:id', editAuthor)

authorRouter.delete('/:id', deleteAuthor )

authorRouter.get('/:id/blogpost', getAuthorPosts)

authorRouter.patch('/:authorId/avatar', uploadCloudinary.single('avatar'), patchAuthor) 

// userRouter.post('/register', register)

export default authorRouter