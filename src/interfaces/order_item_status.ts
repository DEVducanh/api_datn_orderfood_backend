import { Types } from 'mongoose'

export interface IOrderItemStatusHistory {
  _id?: Types.ObjectId
  orderitem_id?: Types.ObjectId | string
  old_status: string
  new_status: string
  changed_by?: Types.ObjectId | null
  changed_at: Date | string
}
