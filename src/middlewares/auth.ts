// các file chứa các hàm xử lý middleware, như validate, check token,

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  id: string
  role: string
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  console.log(authHeader)
  if (!authHeader) {
    return res.status(401).json({ message: 'Bạn chưa đăng nhập' })
  }

  const token = authHeader.split(' ')[1]
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    ;(req as any).user = decoded // gắn user vào req
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' })
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
