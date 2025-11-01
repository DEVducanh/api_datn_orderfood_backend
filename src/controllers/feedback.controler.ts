import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  createFeedBackService,
  getAllFeedBackService,
  getDetailFeedbackSV,
  getFeedBackByDishIdSV
} from '~/services/feedback.service'

export const getAllFeedBackControler = async (req: Request, res: Response) => {
  try {
    const data = await getAllFeedBackService()
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, data })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error Get All FeedBack'
    })
  }
}

export const createFeedBackControler = async (req: Request, res: Response) => {
  try {
    const { user_id, order_id, dish_id, type, rating, content, image } = req.body

    const newFeedBack = await createFeedBackService(user_id, order_id, dish_id, type, rating, content, image)

    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, newFeedBack })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error create FeedBack'
    })
  }
}

export const getFeedBackByDishIdControler = async (req: Request, res: Response) => {
  try {
    const { dish_id } = req.params

    if (!dish_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing dish_id'
      })
    }

    const result = await getFeedBackByDishIdSV(dish_id)

    if (!result.success) {
      return res.status(500).json(result)
    }

    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error while getting feedback by dish_id'
    })
  }
}

export const getDetailFeedbackControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Missing feedback ID'
      })
    }

    const result = await getDetailFeedbackSV(id)

    if (!result.success) {
      return res.status(404).json(result)
    }

    return res.status(200).json({ mesage: DEFAULT_MESSAGE.DEFAULT_SUCCESS, result })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error while getting feedback detail'
    })
  }
}
