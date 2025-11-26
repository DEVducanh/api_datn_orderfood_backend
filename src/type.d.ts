import { Request } from 'express'

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string
      role: number
      username?: string
      phone?: string
    }
  }
}
