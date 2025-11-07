import e, { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  createTableService,
  deleteTableService,
  getAllTableService,
  updateStatusTableService,
  updateTableService
} from '~/services/table.service'

export const getAllTableController = async (req: Request, res: Response) => {
  try {
    const { search, status, page = '1' } = req.query
    const result = await getAllTableService(search as string, status as string, parseInt(page as string, 10))

    res.status(200).json({ success: true, ...result })
  } catch (error) {
    console.log(error)

    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const createTableController = async (req: Request, res: Response) => {
  try {
    const data = await createTableService(req.body)
    return res.status(200).json({ success: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateTableController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await updateTableService(id, req.body)
    return res.status(200).json({ success: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateTableStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const data = await updateStatusTableService(id, status)
    return res.status(200).json({ success: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const deleteTableController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await deleteTableService(id)
    return res.status(200).json({ success: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}
