import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './src/db/db.connect.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config({
    path: '.env'
})
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

connectDB()
.then(
   ()=>{ app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => { 
    console.log("MONGO db connection failed !!! ", err);
})



import userRouter from './src/routes/user.routes.js';
import photoRouter from './src/routes/settingPhoto.routes.js'


app.use('/api/v1/users' , userRouter)
app.use('/api/v1/photos' , photoRouter)



