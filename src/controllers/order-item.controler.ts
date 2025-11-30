import { Request, Response } from 'express'
import { DEFAULT_MESSAGE } from '~/constants/message'
import {
  cancelOrderItemService,
  getHistoryOrderItem,
  getOrderItemsByUserOrTableService,
  getOrderItemService,
  updateManyOrderItemsService,
  updateSttOrderItemService
} from '~/services/order-item.service'

export const getOrderItemControler = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params
    const Orderitems = await getOrderItemService(orderId)

    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, Orderitems })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateSttOderItemControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const user = req.user
    console.log(user)

    if (!user) {
      return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng.' })
    }

    const result = await updateSttOrderItemService(id, status, user)
    console.log('sucsses')

    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, result })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const updateManyOrderItemsController = async (req: Request, res: Response) => {
  try {
    const { orderId, itemIds, newStatus } = req.body
    console.log(orderId)

    const user = req.user as { id: string; role: number }

    console.log(user)

    const result = await updateManyOrderItemsService(orderId, itemIds, newStatus, user)

    return res.status(result.success ? 200 : 400).json(result)
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi hệ thống'
    })
  }
}

export const getOrderItemsByUserOrTableController = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id
    const table_id = req.query.table_id as string | undefined

    const result = await getOrderItemsByUserOrTableService(user_id, table_id)
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, result })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}

export const getHistoryOrderItemController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ success: false, message: 'Thiếu orderItemId' })
    }
    const history = await getHistoryOrderItem(id)

    return res.status(200).json({
      success: true,
      data: history
    })
  } catch (error) {}
}

export const cancelOrderItemController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ success: false, message: 'Thiếu Id' })
    }
    const result = await cancelOrderItemService(id)
    return res.status(200).json({ message: DEFAULT_MESSAGE.DEFAULT_SUCCESS, result })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: DEFAULT_MESSAGE.DEFAULT_ERROR })
  }
}
