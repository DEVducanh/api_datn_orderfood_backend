import { Types } from 'mongoose'
import { IDishes } from './dish.type'

export interface ICart {
  //   _id?: Types.ObjectId
  user_id?: string
  table_id?: string
  order_id?: Types.ObjectId
  total_price: number
}

export interface ICart_item {
  cart_id: Types.ObjectId
  dish_id: Types.ObjectId | IDishes
  quantity: number
  price: number
  note?: string
}
