import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import userRouter from './routes/user.route'
import authRouter from './routes/auth.route'
import cateRouter from './routes/cate.route'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'localhost'
connectDB()
app.use(express.json())

// ...Router
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/category', cateRouter)

app.listen(PORT, () => console.log(`Server running at http://${HOST}:${PORT}`))
