import { Types } from 'mongoose'
import { ORDER_STATUS } from '~/constants/enum'

export interface IOrder {
  table_id?: string
  user_id?: string
  status: ORDER_STATUS
  createdAt?: string
  updatedAt?: string
}
