import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  createOrderService,
  deleteOrderService,
  getAllOrderService,
  getDetailOrderByTableIdService,
  updateOrderService,
  updateOrderStatusService
} from '~/services/order.service'

export const getAllOrderControler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    const limit = parseInt(req.query.limit as string, 10) || 10
    const status = req.query.status as string
    const search = req.query.search as string | undefined


    const result = await getAllOrderService(page, limit, status, search)

    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data: result
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const getDetailOrderByTableIdController = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params

    const order = await getDetailOrderByTableIdService(tableId)

    if (!order) {
      return res.status(404).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
    }

    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data: order
    })
  } catch (error) {
    // console.error(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const createOrderControler = async (req: Request, res: Response) => {
  try {
    const data = await createOrderService(req.body)
    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data
    })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateOrderControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = await updateOrderService(id, req.body)
    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data
    })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateOrderStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
    }

    const updateOrder = await updateOrderStatusService(id, status.toUpperCase())

    if (!updateOrder) {
      return res.status(404).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
    }

    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data: updateOrder
    })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const deleteOrderControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await deleteOrderService(id)
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS })
  } catch (error) {
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}
