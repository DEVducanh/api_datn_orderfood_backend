import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  createDishService,
  deleteDishService,
  getAllDishService,
  getOneDishService,
  updateDishService
} from '~/services/dish.service'

export const getAllDishControler = async (req: Request, res: Response) => {
  try {
    const { search, status, categoryId, page = '1' } = req.query
    const result = await getAllDishService(
      search as string,
      status as string,
      categoryId as string,
      parseInt(page as string, 10)
    )

    res.status(200).json({ success: true, ...result })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const getOneDishControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await getOneDishService(id)
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const createDishControler = async (req: Request, res: Response) => {
  try {
    const { category_id } = req.body
    if (!category_id) {
      return res.status(400).json({ success: false, message: 'category_id là bắt buộc' })
    }
    const data = await createDishService(req.body)

    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateDishControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await updateDishService(id, req.body)
    res.status(201).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const deleteDishControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await deleteDishService(id)
    res.status(201).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}
