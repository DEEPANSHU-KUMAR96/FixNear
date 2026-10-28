import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'

import authRouter from './routes/auth.routes.js'
import issueRouter from './routes/issue.routes.js'

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use (cookieParser())
app.use(morgan('dev'))


app.use("/api/auth", authRouter)
app.use("/api/issues", issueRouter)


export default app;