import { Types } from 'mongoose'

export interface IOrderStatusHistory {
  _id?: Types.ObjectId
  order_id: Types.ObjectId | string
  old_status: string
  new_status: string
  changed_by: number | null
  changed_at: Date | string
  note: string | null
}
