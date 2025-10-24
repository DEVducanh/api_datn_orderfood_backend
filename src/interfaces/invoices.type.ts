import { STATUS_INVOICES } from '~/constants/enum'

export interface IInvoice {
  table_id?: number
  user_id?: number
  order_id?: number
  total_amount: number
  status: STATUS_INVOICES
  created_at?: string
  updated_at?: string
}
