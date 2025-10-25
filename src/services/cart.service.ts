import { ORDER_STATUS } from '~/constants/enum'
import Cart, { Cart_Item } from '../models/cart.model'
import Order from '../models/order.model'
import Dish from '../models/dish.model'
import { IDishes } from '~/interfaces/dish.type'

export const createCartService = async (user_id: string, table_id: string) => {
  try {
    let cart = await Cart.findOne({ user_id, table_id })
    if (!cart) {
      cart = await Cart.create({ user_id, table_id, total_price: 0 })
    }

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

export const addToCartService = async (user_id: string, table_id: string, dish_id: string, quantity: number) => {
  try {
    let cart = await Cart.findOne({ user_id, table_id })
    if (!cart) {
      cart = await createCartService(user_id, table_id)
    }

    let cart_item = await Cart_Item.findOne({ cart_id: cart._id, dish_id })

    const dish = await Dish.findById(dish_id)
    if (!dish) throw new Error('Dish not found')

    const price = dish.price
    if (cart_item) {
      cart_item.quantity += quantity
      // cart_item.price = cart_item.quantity * dish.price
      await cart_item.save()
    } else {
      cart_item = await Cart_Item.create({
        cart_id: cart._id,
        dish_id,
        quantity,
        price: dish.price
      })
    }

    //  Cập nhật lại total_price trong Cart
    const cartItems = await Cart_Item.find({ cart_id: cart._id })
    const total_price = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    cart.total_price = total_price
    await cart.save()

    return {
      success: true,
      message: 'Dish added to cart successfully',
      data: {
        cart,
        cart_item
      }
    }
  } catch (error) {
    // console.log(error)
    throw new Error('Error add to cart')
  }
}

export const checkoutCartService = async (user_id: string, table_id: string) => {
  try {
    // Lấy giỏ hàng hiện tại
    const cart = await Cart.findOne({ user_id, table_id })
    if (!cart) throw new Error('Cart not found')

    // Lấy danh sách món trong cart
    const cartItems = await Cart_Item.find({ cart_id: cart._id })
    if (cartItems.length === 0) throw new Error('Cart is empty')

    //Tính tổng tiền
    const total_price = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    //Tạo order chính thức
    const order = await Order.create({
      user_id,
      table_id,
      items: cartItems.map((item) => ({
        dish_id: item.dish_id,
        quantity: item.quantity,
        price: item.price,
        note: item.note
      })),
      total_price,
      status: ORDER_STATUS.PENDING,
      created_at: new Date()
    })

    // Xóa các cart_item sau khi đặt hàng
    await Cart_Item.deleteMany({ cart_id: cart._id })

    //Reset cart
    cart.total_price = 0
    await cart.save()

    return order
  } catch (error) {
    console.error('Checkout error:', error)
    throw new Error('Error while checking out cart')
  }
}

export const getCartByTableIdService = async (table_id: string) => {
  // Tìm cart theo table_id
  const cart = await Cart.findOne({ table_id })
  if (!cart) {
    return null
  }

  // Lấy danh sách item trong cart
  const items = await Cart_Item.find({ cart_id: cart._id }).populate<{ dish_id: IDishes }>('dish_id')

  //Format dữ liệu
  const formattedItems = items.map((item) => ({
    dish_name: item.dish_id?.dish_name,
    quantity: item.quantity,
    price: item.price
  }))

  // Tính tổng tiền
  const total_price = formattedItems.reduce((sum, i) => sum + i.price, 0)

  //  Trả về object hoàn chỉnh
  return {
    table_id: cart.table_id,
    total_price,
    items: formattedItems
  }
}

export const removeCartItemService = async (id: string) => {
  // Tìm cart item để biết thuộc cart nào
  const cartItem = await Cart_Item.findById(id)
  if (!cartItem) return null

  // Xóa item đó
  await Cart_Item.findByIdAndDelete(id)

  // Sau khi xóa, cập nhật lại total_price trong bảng Cart
  const cartItems = await Cart_Item.find({ cart_id: cartItem.cart_id })
  const total_price = cartItems.reduce((sum, item) => sum + (item.price || 0), 0)

  await Cart.findByIdAndUpdate(cartItem.cart_id, { total_price })

  return { message: 'Item removed successfully', total_price }
}
