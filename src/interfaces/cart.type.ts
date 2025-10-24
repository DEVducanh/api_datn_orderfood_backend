import { Types } from 'mongoose'

export interface ICart {
  //   _id?: Types.ObjectId
  user_id?: string
  table_id?: string
  order_id?: Types.ObjectId
  total_price: number
}

export interface ICart_item {
  cart_id: Types.ObjectId
  dish_id: Types.ObjectId
  quantity: number
  price: number
  note?: string
}
