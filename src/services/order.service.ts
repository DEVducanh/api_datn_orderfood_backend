import { IOrder } from '~/interfaces/order.type'
import Order from '../models/order.model'
import OrderItem from '../models/order-item.model'
import { ORDER_ITEM_STATUS, ORDER_STATUS } from '~/constants/enum'
import mongoose from 'mongoose'
import orderItemModel from '../models/order-item.model'

export const buildOrderPipeline = (dbQuery: any, dbSort: any, search?: string) => {
  const pipeline: any[] = []

  if (dbQuery && Object.keys(dbQuery).length > 0) {
    pipeline.push({ $match: dbQuery })
  }

  pipeline.push(
    {
      $lookup: {
        from: 'tables',
        localField: 'table_id',
        foreignField: '_id',
        as: 'table'
      }
    },
    { $unwind: { path: '$table', preserveNullAndEmptyArrays: true } }
  )

  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
  )

  if (search && search.trim() !== '') {
    const regex = new RegExp(search, 'i')
    pipeline.push({
      $match: {
        $or: [{ 'table.table_name': regex }, { 'user.username': regex }]
      }
    })
  }

  if (dbSort && Object.keys(dbSort).length > 0) {
    pipeline.push({ $sort: dbSort })
  } else {
    pipeline.push({ $sort: { createdAt: -1 } })
  }

  return pipeline
}

export const getAllOrderService = async (page: number = 1, status?: string, search?: string) => {
  try {
    const dbQuery: any = {}

    if (status) {
      dbQuery.status = { $regex: new RegExp(`^${status}$`, 'i') }
    }

    const dbSort = { createdAt: -1 }

    const pipeline = buildOrderPipeline(dbQuery, dbSort, search)
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
    throw new Error('Cannot create order !!')
  }
}

export const updateOrderService = async (id: string, data: IOrder) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(id, data, { new: true })
    return updateOrder
  } catch (error) {
    throw new Error('cannot update Order')
  }
}

export const updateOrderStatusService = async (id: string, status: string) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true })

    if (!updatedOrder) {
      throw new Error('Order not found')
    }

    let updatedItemsResult = null
    if (updatedOrder.status === ORDER_STATUS.COMPLETED) {
      const filter = { order_id: new mongoose.Types.ObjectId(id) }

      const updateDoc = {
        $set: { status: ORDER_ITEM_STATUS.SERVED, updatedAt: new Date() }
      }

      updatedItemsResult = await OrderItem.updateMany(filter, updateDoc)
    }

    if (updatedOrder.status === ORDER_STATUS.CANCELED) {
      const filter = { order_id: new mongoose.Types.ObjectId(id) }

      const updateDoc = {
        $set: { status: ORDER_ITEM_STATUS.CANCELED, updatedAt: new Date() }
      }

      updatedItemsResult = await OrderItem.updateMany(filter, updateDoc)
    }

    return {
      updatedOrder,
      updatedItemsResult
    }
  } catch (error: any) {
    throw new Error('Cannot update order status')
  }
}

export const deleteOrderService = async (id: string) => {
  try {
    const order = await Order.findByIdAndDelete(id, { new: true })
    return order
  } catch (error) {
    throw new Error('cannot delete Order')
  }
}

export const getAllOrderByTableService = async (tableId: string, userId?: string) => {
  try {
    const filter: any = { table_id: new mongoose.Types.ObjectId(tableId) }

    if (userId) filter.user_id = userId

    const orders = await Order.find(filter).select('-orderItems').lean()

    return {
      success: true,
      data: orders
    }
  } catch (error) {
    throw new Error('Cannot get all order !!')
  }
}

export const cancelUserOrderService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid order ID')

  const order = await Order.findById(id)
  if (!order) throw new Error('Order Không tìm thấy')
  if (order.status !== ORDER_STATUS.PENDING) throw new Error('Đầu bếp đã làm không thể hủy')

  order.status = ORDER_STATUS.CANCELED
  order.updatedAt = new Date().toISOString()
  const updatedOrder = await order.save()

  const updatedItemsResult = await OrderItem.updateMany(
    { order_id: new mongoose.Types.ObjectId(id) },
    { $set: { status: ORDER_ITEM_STATUS.CANCELED, updatedAt: new Date() } }
  )

  return { updatedOrder, updatedItemsResult }
}
