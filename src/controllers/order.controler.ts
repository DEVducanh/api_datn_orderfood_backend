import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'

export const getAllOrderControler = async (req: Request, res: Response) => {
  try {
    const { page, limit, status } = req.query
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}
