import { Types } from 'mongoose'
import { ORDER_STATUS } from '~/constants/enum'

export interface IOrder {
  _id?: Types.ObjectId
  table_id?: string
  user_id?: string
  total_price?: number
  status: ORDER_STATUS
  createdAt?: string
  updatedAt?: string
}
