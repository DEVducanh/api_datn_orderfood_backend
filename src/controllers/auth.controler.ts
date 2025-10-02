import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import { loginService, registerService } from '~/services/auth.service'

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
    res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      token,
      user
    })
  } catch (error) {
    res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}
