import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  createUserService,
  deleteUserService,
  getAllUserService,
  getOneUserService,
  UpdateUserService
} from '~/services/user.service'

export const getAllUserControler = async (req: Request, res: Response) => {
  try {
    const data = await getAllUserService()
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const getOneUserControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await getOneUserService(id)
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const createUserControler = async (req: Request, res: Response) => {
  try {
    const data = await createUserService(req.body)
    res.status(201).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateUserControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await UpdateUserService(id, req.body)
    res.status(201).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const deleteUserControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await deleteUserService(id)
    res.status(201).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}
