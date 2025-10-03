import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoryService,
  getOneCategoryService,
  updateCategoryService
} from '~/services/category.service'

export const getAllCategoryControler = async (req: Request, res: Response) => {
  try {
    const { search, status, page = '1' } = req.query
    const result = await getAllCategoryService(search as string, status as string, parseInt(page as string, 10))

    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, ...result })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const getOneCategoryControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await getOneCategoryService(id)
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const createCategoryControler = async (req: Request, res: Response) => {
  try {
    const data = await createCategoryService(req.body)
    res.status(201).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateCategoryControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await updateCategoryService(id, req.body)
    res.status(201).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const deleteCategoryControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await deleteCategoryService(id)
    res.status(201).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS })
  } catch (error) {
    return res.status(500).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}
