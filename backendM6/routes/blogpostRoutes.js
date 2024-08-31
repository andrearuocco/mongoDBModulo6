import express from 'express'
import { addBlogPost, getAllBlPo, getSingle, editBlPo, deleteOne, patchPost } from '../controllers/blogpost.controller.js';
import { addOne, getComments, getSingleComment, editComment, deleteComment } from '../controllers/comment.controller.js';
import uploadCloudinary from '../middleware/uploadCloudinary.js';

const blogpostRouter = express.Router()

blogpostRouter.post('/', uploadCloudinary.single('cover'), addBlogPost) // per caricare la cover di un blogPost direttamente quanto viene caricato un nuovo blogPost

blogpostRouter.get('/', getAllBlPo)

blogpostRouter.get('/:id', getSingle)

blogpostRouter.put('/:id', editBlPo)

blogpostRouter.delete('/:id', deleteOne) 

blogpostRouter.patch('/:blogPostId/cover', uploadCloudinary.single('cover'), patchPost)

blogpostRouter.post('/:blogpostId/comments',addOne)
blogpostRouter.get('/:blogpostId/comments', getComments)
blogpostRouter.get('/:blogpostId/comments/:commentId', getSingleComment)
blogpostRouter.put('/:blogpostId/comment/:commentId', editComment)
blogpostRouter.delete('/:blogpostId/comment/:commentId', deleteComment)

export default blogpostRouter