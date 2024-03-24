import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './src/db/db.connect.js';
import cors from 'cors';
dotenv.config({
    path: '.env'
})
const app = express();

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))

connectDB()
.then(
   ()=>{ app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
