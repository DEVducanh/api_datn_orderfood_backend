// các file chứa các hàm xử lý middleware, như validate, check token,

import ObjectID from 'bson-objectid'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

interface JwtPayload {
  id: string
  role: number
  type: 'user' | 'guest'
  username?: string
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  let token = authHeader?.split(' ')[1]

  if (!token) {
    const guestId = ObjectID().toHexString()
    token = jwt.sign({ id: guestId, type: 'guest', role: 0 }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.setHeader('x-guest-token', token)
    // console.log('Created guest token:', token)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.user = { id: decoded.id, role: decoded.role }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export const roleMiddleware = (roles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Không đủ quyền hạn' })
    }
    next()
  }
}
