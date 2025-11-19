import 'express-session'

declare module 'express-session' {
  interface SessionData {
    tableId?: string
    cart?: any[]
    userInfo?: {
      name: string
      phone: string
    } | null
    loggedInUser?: {
      id: number
      name: string
      phone: string
    } | null
  }
}
