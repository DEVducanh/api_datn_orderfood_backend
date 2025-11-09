import { Types } from 'mongoose'

export interface ITransaction {
  _id?: Types.ObjectId
  payment_id?: Types.ObjectId | string
  user_id?: Types.ObjectId | string
  invoices_id?: Types.ObjectId | string
  type: string
  status: 'Completed' | 'Cancelled'
  amount_paid: number
  create_at?: string
}
