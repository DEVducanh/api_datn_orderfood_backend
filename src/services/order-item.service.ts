import { ORDER_ITEM_STATUS, ORDER_STATUS, USER_ROLE } from '~/constants/enum'
import OrderItem from '../models/order-item.model'
import Order from '../models/order.model'
import OrderItemStatusHistory from '../models/order-item-status.model'
import { Types } from 'mongoose'

const STATUS_TRANSITION_PERMISSIONS: {
  [key in ORDER_ITEM_STATUS]?: {
    [key in ORDER_ITEM_STATUS]?: USER_ROLE[]
  }
} = {
  [ORDER_ITEM_STATUS.PENDING]: {
    [ORDER_ITEM_STATUS.PROCESSING]: [USER_ROLE.CHEF],
    [ORDER_ITEM_STATUS.CANCELED]: [USER_ROLE.CUSTOMER, USER_ROLE.WAITER, USER_ROLE.CHEF]
  },
  [ORDER_ITEM_STATUS.PROCESSING]: {
    [ORDER_ITEM_STATUS.READY]: [USER_ROLE.CHEF],
    [ORDER_ITEM_STATUS.CANCELED]: [USER_ROLE.WAITER, USER_ROLE.CHEF]
  },
  [ORDER_ITEM_STATUS.READY]: {
    [ORDER_ITEM_STATUS.SERVED]: [USER_ROLE.WAITER],
    [ORDER_ITEM_STATUS.CANCELED]: [USER_ROLE.WAITER]
  }
}

export const updateSttOrderItemService = async (
  id: string,
  status: ORDER_ITEM_STATUS,
  user: { id: Types.ObjectId | string; role: number }
) => {
  try {
    if (!id) throw new Error('Thiếu order item id')
    if (!status) throw new Error('Thiếu status')
    if (!user) throw new Error('Thông tin người dùng không hợp lệ')

    const userId = user.id

    const userRole = user.role as USER_ROLE

    const orderItem = await OrderItem.findById(id)
    if (!orderItem) throw new Error('Không tìm thấy order item')

    if (orderItem.status === ORDER_ITEM_STATUS.CANCELED || orderItem.status === ORDER_ITEM_STATUS.SERVED) {
      return {
        success: false,
        message: `Không thể cập nhật mục đơn hàng đã ${orderItem.status === ORDER_ITEM_STATUS.CANCELED ? 'Hủy' : 'Phục vụ'}`
      }
    }

    const allowedRoles = STATUS_TRANSITION_PERMISSIONS[orderItem.status]?.[status]

    if (!allowedRoles) {
      return {
        success: false,
        message: `Chuyển trạng thái từ ${orderItem.status} đến ${status} không hợp lệ hoặc không được phép.`
      }
    }

    if (!allowedRoles.includes(userRole)) {
      return { success: false, message: 'Người dùng không có quyền thực hiện chuyển trạng thái này' }
    }

    orderItem.status = status

    const historyRecord = new OrderItemStatusHistory({
      orderitem_id: orderItem._id,
      old_status: orderItem.status,
      new_status: status,
      changed_by: userId
    })
    await historyRecord.save()

    await orderItem.save()

    const orderId = orderItem.order_id
    const totalItems = await OrderItem.countDocuments({ order_id: orderId })
    const servedCount = await OrderItem.countDocuments({ order_id: orderId, status: ORDER_ITEM_STATUS.SERVED })
    const canceledCount = await OrderItem.countDocuments({ order_id: orderId, status: ORDER_ITEM_STATUS.CANCELED })

    let updatedOrder = null

    if (servedCount + canceledCount === totalItems) {
      const newOrderStatus = canceledCount === totalItems ? ORDER_STATUS.CANCELED : ORDER_STATUS.COMPLETED
      updatedOrder = await Order.findByIdAndUpdate(orderId, { status: newOrderStatus }, { new: true })
    } else {
      updatedOrder = await Order.findById(orderId)
    }

    return {
      success: true,
      message: `Cập nhật trạng thái order item thành công: ${orderItem.status} -> ${orderItem.status}`,
      data: {
        order_item: orderItem,
        order_status: updatedOrder?.status
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái order item'
    }
  }
}

export const getOrderItemService = async (order_id: string) => {
  try {
    const data = await OrderItem.find({ order_id }).populate('dish_id', 'dish_name imageUrl price')

    if (!data || data.length === 0) {
      return {
        success: false,
        message: 'No order items found for this order_id'
      }
    }

    return data
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Order Item'
    }
  }
}

export const getOrderItemsByUserOrTableService = async (user_id?: string, table_id?: string) => {
  try {
    if (!user_id && !table_id) {
      return {
        success: false,
        message: 'Thiếu user_id hoặc table_id'
      }
    }

    let orders: any = []

    // Nếu có user_id thì ưu tiên tìm theo user
    if (user_id) {
      orders = await Order.find({ user_id })
    } else if (table_id) {
      orders = await Order.find({ table_id })
    }

    if (orders.length === 0) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng nào'
      }
    }

    const orderIds = orders.map((o: any) => o._id)

    const orderItems = await OrderItem.find({ order_id: { $in: orderIds } })
      .populate('dish_id', 'dish_name price imageUrl')
      .populate('order_id', 'status table_id user_id')
      .exec()

    return {
      success: true,
      message: 'Lấy danh sách món ăn đã đặt thành công',
      data: orderItems
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách món ăn đã đặt'
    }
  }
}

export const getHistoryOrderItem = async (id: string) => {
  try {
    const history = await OrderItemStatusHistory.find({ orderitem_id: id })
      .sort({ createdAt: -1 })
      .populate('changed_by', 'username role')

    return {
      success: true,
      data: history
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Lỗi khi lấy lịch sử món ăn'
    }
  }
}

export const cancelOrderItemService = async (id: string) => {
  const orderItem = await OrderItem.findById(id)
  if (!orderItem) throw new Error('Order Item Không tìm thấy')
  if (orderItem.status !== ORDER_ITEM_STATUS.PENDING) throw new Error('Đầu bếp đã làm không thể hủy')

  orderItem.status = ORDER_ITEM_STATUS.CANCELED
  const newOrderItem = await orderItem.save()

  return newOrderItem
}
