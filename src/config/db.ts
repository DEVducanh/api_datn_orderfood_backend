import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.DB_URL as string
    if (!uri) {
      throw new Error('MONGO_URI is not defined in .env')
    }

    await mongoose.connect(uri)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1) // dừng app nếu không connect được
  }
}

export default connectDB
