import ObjectID from 'bson-objectid'
import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import { loginService, registerService } from '~/services/auth.service'
import jwt from 'jsonwebtoken'

export interface JwtPayload {
  id: string
  role: number
  type: 'user' | 'guest'
  username?: string
  phone?: string
}

export const registerController = async (req: Request, res: Response) => {
  try {
    const newUser = await registerService(req.body)
    res.status(201).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      newUser
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {
    const { user, token } = await loginService(req.body)
    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      token,
      user
    })
  } catch (error) {
    console.log(error)

    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateGuestInfo = (req: Request, res: Response) => {
  const { username, phone } = req.body

  let payload = req.user!

  payload.username = username
  payload.phone = phone

  const newToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  })

  res.setHeader('x-guest-token', newToken)

  return res.json({
    message: 'Update guest info successfully',
    token: newToken,
    data: payload
  })
}
