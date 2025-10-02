import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/config/message'
import { createUserService } from '~/services/user.service'

export const createUserControler = async (req: Request, res: Response) => {
  try {
    console.log(req.body)

    const data = await createUserService(req.body)
    res.status(201).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}
