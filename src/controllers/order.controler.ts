import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { DEFAULT_MESSAGE } from '~/constants/message'
import { checkoutCartService } from '~/services/cart.service'
import {
  createOrderService,
  deleteOrderService,
  getAllOrderService,
  getDetailOrderByTableIdService,
  getOrderByTableService,
  updateOrderService,
  updateOrderStatusService
} from '~/services/order.service'

export const getAllOrderControler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    const status = req.query.status as string
    const search = req.query.search as string | undefined

    const result = await getAllOrderService(page, status, search)

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
    const user_id = req.user?.id

    if (!user_id) {
      return res.status(401).json({ message: 'Missing user id' })
    }

    const orderData = {
      ...req.body,
      user_id: user_id
    }
    const data = await createOrderService(orderData)
    return res.status(200).json({
      message: DEFAULT_MESSAGE.DEFAULT_SUCCESS,
      data
    })
  } catch (error) {
    console.log(error)

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

    const updateOrder = await updateOrderStatusService(id, status)

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

export const checkoutCartController = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id
    const { table_id } = req.body

    if (!user_id || !table_id) {
      return res.status(400).json({
        success: false,
        message: 'Yêu cầu user_id và table_id'
      })
    }

    const order = await checkoutCartService(user_id, table_id)

    res.status(201).json({
      success: true,
      message: 'Order Tạo thành công',
      data: order
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Thất bại khi tạo order'
    })
  }
}

export const getOrderByTableController = async (req: Request, res: Response) => {
  try {
    const { tableId } = req.params
    const user_id = req.user?.id

    if (!mongoose.Types.ObjectId.isValid(tableId)) {
      return res.status(400).json({
        success: false,
        message: 'TableId không hợp lệ'
      })
    }

    const result = await getOrderByTableService(tableId, user_id)
    res.status(result.success ? 200 : 400).json(result)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    })
  }
}
