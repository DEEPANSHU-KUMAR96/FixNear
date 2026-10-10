import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import authRouter from './routes/auth.routes.js'

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use (cookieParser())
app.use(morgan('dev'))


app.use("/api/auth", authRouter)



export default app;