import { IOrder } from '~/interfaces/order.type'
import Order from '../models/order.model'
import { ORDER_STATUS } from '~/constants/enum'

interface getOrderParams {
  page?: number
  limit?: number
  status?: ORDER_STATUS
  search?: string
}

export const getAllOrderService = async ({ page = 1, limit = 10, status }: getOrderParams) => {
  try {
    const skip = (page - 1) * 10

    const filter: any = {}
    if (status) {
      filter.status = status
    }

    const orders = await Order.find(filter)
      .populate('table_id', 'table_name')
      .populate('user_id', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return orders
  } catch (error) {
    // console.log(error)
    throw new Error('Cannot get all order !!')
  }
}

export const createOrderService = async (data: IOrder): Promise<IOrder> => {
  try {
    const newOrder = await new Order(data).save()
    return newOrder
  } catch (error) {
    // console.log(error)
    throw new Error('Cannot create order !!')
  }
}

export const updateOrderService = async (id: string, data: IOrder) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(id, data, { new: true })
    return updateOrder
  } catch (error) {
    throw new Error('cannot update Oder')
  }
}
