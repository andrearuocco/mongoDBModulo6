import blogPost from '../models/blogpostSchema.js'
import Author from '../models/authorSchema.js' 
import transport from '../services/serviceMail.js';

export const addBlogPost = async (req, res) => {
    // crea nuova istanza del modello blogpost con i dati definiti nel corpo della richiesta 
    // per RestClient per Code => const blogpost = new blogPost(req.body) 
    /* blogPost di questo tipo 
    {
        "category": "Category2",
        "title": "La guerra fredda e il mondo diviso",
        "readTime": {
            "value": 36,
            "unit": "sec"
        },
        "author": "66d2e60e3bd1d520a9ab8840",
        "content": "This is the content of my awesome blog post.",
        "tags": [
            {"name": "history"},
            {"name": "politics scienze"}
        ]
    }
    in http PUT /blogpost */ 
    const blogpost = new blogPost({
        ...req.body,
        cover: req.file.path, // percorso del file caricato
        readTime: JSON.parse(req.body.readTime) // parso readTime in quanto inviato come stringa JSON
    }); 
    let newBlPo
    try {
        newBlPo = await blogpost.save() // salva i dati nel DB
        // mando in risposta il nuovo blogpost salvato 
        res.send(newBlPo) // non eseguo il return per poter mandare la mail e dunque per entrare nel secondo blocco try 
    } catch (error) {
        return res.status(400).send(error)
    }
    try {
        const author = await Author.findById(newBlPo.author)
        await transport.sendMail({
            from: 'noreply@epicoders.com', // sender address
            to: author.email, // list of receivers
            subject: "New blogPost", // Subject line
            text: "You have created a new blog post!", // plain text body
            html: "<b>You have created a new blog post.</b>" // html body
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAllBlPo = async (req,res) => {
    try {
        const page = req.query.page || 1; // definisce la pagina, se non specificata nella richiesta utente si va a pagina 1
        let perPage = req.query.perPage || 4; // definisce quanti elementi devono stare nella pagina 
        perPage = perPage > 20 ? 4 : perPage // se l'utente richiede più di 20 posts su una pagina saranno mostrati 4 posts come di default

        const blogpost = await blogPost.find(req.query.title ? {title: {$regex: req.query.title, $options: 'i'}} : {}) // cerca tra i posts secondo il titolo 
            .collation({locale: 'it'}) // ignora le maiuscole nell'ordinamento secondo il sort 
            // .sort({ title: 1, category: 1 }) // ordino gli oggetti JSON in ordine crescente secondo il nome e la categoria 
            // .skip((page - 1) * perPage) // salto documenti pagina precedente 
            // .limit(perPage) // indico gli elementi da mostrare per pagina
            .populate('author');

        const totalResults = await blogPost.countDocuments();
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: blogpost,
            totalPages,
            totalResults,
            page,
        });
    } catch(err) {
        res.status(404).send({ error: "An error occurred", details: err.message });
    }
}

export const getSingle = async (req,res) => {
    // cerco una specifica istanza del modello autore recuperando l'id dalla richiesta 
    const {id} = req.params
    try { 
        const blogpost = await blogPost.findById(id)
        res.send(blogpost)
    } catch(error) {
        res.status(404).send({message: 'Not Found'})
    }
}

export const editBlPo = async (req, res) => {
    const { id } = req.params
    try {
        const blogpost = await blogPost.findByIdAndUpdate(id, req.body, { new: true }) // lo trovi e lo modifichi, new: true consente di rispondere con l'oggetto successivo al salvataggio
        await blogpost.save(); // salvo l'istanza modificata nel DB
        res.send(blogpost)
    } catch (error) {
        res.status(400).send({ message: `Not Found ${id} to edit` })
    }
}

export const deleteOne = async (req, res) => {
    const { id } = req.params
    try {
        const blogpost = await blogPost.findByIdAndDelete(id)
        res.send(`Successfully deleted blogpost with id ${id}.`)
    } catch(error) {
        res.status(404).send({message: `ID ${id} not found`})
    }
}

export const patchPost = async (req,res)=>{ 
    const {blogPostId} =req.params
    try {
        const blogpost = await blogPost.findByIdAndUpdate(blogPostId, {cover: req.file.path}, {new:true}) 
      
        res.status(200).send(blogpost)
    } catch (error) {
        res.status(400).send(error)
    }
}