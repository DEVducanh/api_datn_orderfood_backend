declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: number
        type: 'guest' | 'user'
        username?: string
      } | null
    }
  }
}
