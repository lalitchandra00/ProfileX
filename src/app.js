import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

app.use(Cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "10kb"}))
app.use(express.urlencoded({limit : "10kb"}))
app.use(express.static("public"))
app.use(cookieParser)


export {app}        