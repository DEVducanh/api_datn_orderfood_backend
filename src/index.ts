import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import userRouter from './routes/user.route'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'localhost'
connectDB()

// ...Router
app.use('/users', userRouter)

app.listen(PORT, () => console.log(`Server running at http://${HOST}:${PORT}`))
