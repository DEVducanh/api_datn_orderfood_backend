import { IOrder } from '~/interfaces/order.type'
import Order from '../models/order.model'
import path from 'path'

export const getAllOrderService = async (page: number = 1, limit: number = 10, status?: string, search?: string) => {
  try {
    const skip = (page - 1) * 10
    const match: Record<string, any> = {}
    const filter: any = {}

    if (status) {
      filter.status = { $regex: new RegExp(`^${status}$`, 'i') }
    }

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'tables',
          localField: 'table_id',
          foreignField: '_id',
          as: 'table'
        }
      },
      { $unwind: { path: '$table', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $match: match }
    ]

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'table.table_name': { $regex: search, $options: 'i' } },
            { 'user.username': { $regex: search, $options: 'i' } }
          ]
        }
      })
    }

    pipeline.push({ $sort: { createdAt: -1 } })
    pipeline.push({ $skip: skip })
    pipeline.push({ $limit: limit })

    const orders = await Order.aggregate(pipeline)

    return orders
  } catch (error) {
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
    throw new Error('Cannot get order by table id !!')
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

export const deleteOrderService = async (id: string) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(id, { new: true })
    return deleteOrder
  } catch (error) {
    throw new Error('cannot delete Oder')
  }
}
