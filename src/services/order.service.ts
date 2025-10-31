import { IOrder } from '~/interfaces/order.type'
import Order from '../models/order.model'

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
    // console.log(error)
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

    return updatedOrder
  } catch (error) {
    // console.error('Lỗi trong updateOrderStatusService:', error)
    throw new Error('cannot update Order status')
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
