import Comment from '../models/commentSchema.js'

export const addOne = async (req,res)=>{   
    const blogPoId = req.params.blogpostId
    const commentInfo = req.body
    try {
        const newComment = new Comment ({...commentInfo, blogpost: blogPoId}) // crea un nuovo commento seguendo il corpo della richiesta per il blogpost con id contentuto anch'esso nella richiesta utente 
         
        const createdComment = await newComment.save()
        
        res.status(200).send({data: createdComment})
    } catch (error) {
        res.status(400).send(error)
    }  
}

export const getComments = async (req,res)=>{
    try {
        const comments = await Comment.find({
            blogpost: req.params.blogpostId,
        }).populate('blogpost', {content:0, _id:1})
       
        res.send({
            dati: comments,
        })
    } catch (error) {
        res.status(404).send({message: 'Not Found'})
    }  
}

export const getSingleComment = async (req, res) => {
    try {
        const singleComment = await Comment.findOne({ blogpost: req.params.blogpostId, _id: req.params.commentId })
        return res.status(200).send(singleComment)
    } catch (error) {
        return res.status(404).send({ message: 'Not Found' })
    }
}

export const editComment = async (req, res) => {
    try {
        const comment = await Comment.exists({ _id: req.params.commentId }) // il metodo exists verifica che il commento identificato dalla richiesta sia presente nella collection comments
        if (comment) {
            const singleComment = await Comment.findOneAndUpdate(
                { blogpost: req.params.blogpostId, _id: req.params.commentId },
                { $set: req.body }, // modifica un preciso commento di uno specifico blogpost secondo il corpo della richiesta
                { new: true }
            )
            return res.status(200).send(singleComment)
        } else { 
            return res.status(404).send({ message: 'Comment not found' }) // se il commento non fosse presente gestisco il corrispondente errore 404
        }
    } catch (error) {
        res.status(400).send(error)
    }
}

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.exists({ _id: req.params.commentId })
        if (comment) {
            const commentToDelete = await Comment.findOneAndDelete(
                { blogpost: req.params.blogpostId, _id: req.params.commentId }
            )
            return res.status(200).send(`Successfully deleted comment with id: ${req.params.commentId}`)
        } else {
            return res.status(404).send({ message: 'Comment not found' })
        }
    } catch (error) {
        res.status(400).send(error)
    }
}