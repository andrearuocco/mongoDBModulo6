import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import authorRoutes from './routes/authorRoutes.js'
import blogpostRouter from './routes/blogpostRoutes.js'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'
import morgan from 'morgan'
import helmet from 'helmet'

/* 
import blogPost from './models/blogpostSchema.js'
import { faker } from '@faker-js/faker';
const generateblogPost = (num) => {
    const blogpost = [];
    for (let i = 0; i < num; i++) {
        const category = faker.number.int({ min: 1, max: 5 });
        const title = faker.lorem.sentences(1);
        const readTime = {
            "value": faker.number.int({ min: 1, max: 216000 }),
            "unit": "sec"
        };
        const content = faker.lorem.sentences(10);
        blogpost.push({
            category,
            title,
            readTime,
            content,
        });
    }
    return blogpost;
};
const blogpost = generateblogPost(20);
blogPost.insertMany(blogpost)
    .then(docs => console.log(`${docs.length} users have been inserted into the database.`))
    .catch(err => {
        console.error(err);
        console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    }); 
*/

const port = process.env.PORT || 5001
const host = process.env.HOST || 'http://localhost:5001/'
const server = express()

server.use(express.json()) // express è un middleware utilizzato in modo che il server riconosca come JSON il body delle richieste
server.use(cors()) // cors è un middleware che consente la connessione tra il server di backend e quello di frontend
server.use(morgan("dev")) // middleware che mostra i log delle richieste http
server.use(helmet()) // modulo che aiuta a proteggere le applicazioni

server.use('/author', authorRoutes)
server.use('/blogpost', blogpostRouter)
server.use('/api/v1', authRouter) 

await mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connessione al database...'))
    .catch((err) => console.log(err))

server.listen(port, () => {
    console.log(`Server is listening at port ${port} at ${host}`)
})