import Author from '../models/authorSchema.js'
import blogPost from '../models/blogpostSchema.js'

export const addAuthor = async (req, res) => {
    // crea nuova istanza del modello author con i dati definiti nel corpo della richiesta 
    const author = new Author(req.body)
    author.avatar = author.avatar ? author.avatar : 'https://thumbs.dreamstime.com/z/disegno-vettoriale-immagine-profilo-avatar-vuoto-262683009.jpg?ct=jpeg'
    try {
        await author.save() // salva i dati nel DB
        
        return res.send(author)  // mando in risposta il nuovo author salvato 
    } catch (error) {
        return res.status(400).send(error)
    }
}

export const getAllAuthor = async (req,res) => {
    try {
        const page = req.query.page || 1;
        let perPage = req.query.perPage || 3;
        perPage = perPage > 9 ? 3 : perPage  // se l'utente richiede più di 20 authors su una pagina saranno mostrati 3 authors come di default

        const author = await Author.find({})
            .collation({locale: 'it'}) //serve per ignorare maiuscole e minuscole nell'ordine alfabetico del sort
            .sort({name:1, surname:1})  // ordino gli oggetti JSON in ordine alfabetico secondo il nome e la cognome
            .skip((page - 1) * perPage) // salto documenti pagina precedente 
            .limit(perPage); // indico gli elementi da mostrare per pagina

        const totalResults = await Author.countDocuments(); // conta tutti i documenti author nella collection 
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: author,
            totalPages,
            totalResults,
            page,
        });
    } catch(err) {
        res.status(404).send();
    }
}

export const getSingleAuthor = async (req,res)=>{
    const {id} =req.params
    try {
        const author = await Author.findById(id)
        res.send(author) 
    } catch (error) {
        res.status(404).send({message: 'Not Found'})
    }
}

export const editAuthor = async (req, res)=>{
    const {id} =req.params
    try {
        const author = await Author.findByIdAndUpdate(id, req.body, { new: true }) // trovo l'autore attraverso il proprio id pescato dalla richiesta e modifico i campi secondo il suo corpo
        await author.save(); // salvo le modifiche sul DB
        res.send(author)
    } catch (err) {
        res.status(400).send(err)
    }
}

export const deleteAuthor = async (req, res) => {
    const { id } = req.params
    try {
        const blogpost = await Author.findByIdAndDelete(id)
        res.send(`Successfully deleted author with id ${id}.`)
    } catch (error) {
        res.status(404).send({ message: `ID ${id} not found` })
    }
}

export const patchAuthor = async (req, res) => {
    // la patch serve per modificare una risorsa nel DB che esiste già
    const { authorId } = req.params // recupero l'id dalla richiesta
    try {
        const author = await Author.findByIdAndUpdate(authorId, { avatar: req.file.path }, { new: true }) // trovo l'autore attraverso il proprio id esplicitato nella richiesta e lo modifica secondo il corpo di quest'ultima

        res.status(200).send(author)
    } catch(error) {
        res.status(400).send(error)
    }
}

/* http://localhost:5001/66d8273d12e5f0cd8286e6f0/blogpost */
export const getAuthorPosts = async (req, res) => {
    const {id} =req.params
    try {
        const author = await Author.findById(id)
        const singlePost = await blogPost.find({ author: author })
        res.send(singlePost) 
    } catch (error) {
        res.status(404).send({message: 'Not Found'})
    }
}
