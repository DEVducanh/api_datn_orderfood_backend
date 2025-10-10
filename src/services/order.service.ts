import { IOrder } from '~/interfaces/order.type'
import Order from '../models/order.model'

export const getAllOrderService = async (page: number = 1, limit: number = 10, status?: string) => {
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

export const getDetailOrderByTableIdService = async (tableId: string) => {
  try {
    const order = await Order.findOne({ table_id: tableId }).populate('table_id').populate('user_id')

    if (!order) {
      return null
    }

    return order
  } catch (error) {
    console.error('Lỗi trong getOneOrderByTableIdService:', error)
    throw error
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

export const updateOrderStatusService = async (id: string, status: string) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true })

    return updatedOrder
  } catch (error) {
    // console.error('Lỗi trong updateOrderStatusService:', error)
    throw new Error('cannot update Oder status')
  }
}
