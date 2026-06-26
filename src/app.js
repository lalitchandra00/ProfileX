import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import User from './models/User.js'

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN || "*",
    credentials : true
}))

app.use(express.json({limit : "10kb"}))
app.use(express.urlencoded({extended: true, limit : "10kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// AI coded this part
app.post('/api/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
// Till here


export { app }