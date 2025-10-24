import { ORDER_STATUS } from '~/constants/enum'
import Cart, { Cart_Item } from '../models/cart.model'
import Order from '../models/order.model'

export const createCartService = async (user_id: string, table_id: string) => {
  try {
    let cart = await Cart.findOne({ user_id, table_id })
    if (!cart) {
      cart = await Cart.create({ user_id, table_id, total_price: 0 })
    }

    const order = await Order.create({
      user_id,
      table_id,
      status: ORDER_STATUS.PENDING,
      created_at: new Date()
    })
    cart.order_id = order._id
    await cart.save()

    const cartItems = await Cart_Item.find({ cart_id: cart._id })
    const total_price = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    cart.total_price = total_price
    await cart.save()

    return cart
  } catch (error) {
    // console.log(error)
    throw new Error('Error creating cart')
  }
}

export const addToCart = async () => {
  try {
  } catch (error) {
    throw new Error('Error add to cart')
  }
}
