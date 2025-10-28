import { STATUS_INVOICES } from '~/constants/enum'
import Invoices from '../models/invoices.model'

export const getAllInvoiceService = async () => {
  try {
    const invoices = await Invoices.find()

    if (!invoices || invoices.length === 0) {
      return {
        success: true,
        message: 'No invoices found',
        data: []
      }
    }

    // Trả kết quả thành công
    return {
      success: true,
      message: 'Get all invoices successfully',
      data: invoices
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Invoices'
    }
  }
}

export const createInvoiceService = async (payload: {
  order_id: string
  user_id: string
  table_id: string
  total_amount: number
}) => {
  try {
    const newInvoice = new Invoices({
      user_id: payload.user_id || null,
      table_id: payload.table_id,
      order_id: payload.order_id,
      total_amount: payload.total_amount,
      status: STATUS_INVOICES.UNPAID,
      created_at: new Date(),
      updated_at: new Date()
    })

    const savedInvoice = await newInvoice.save()

    return {
      success: true,
      message: 'Invoice created successfully',
      data: savedInvoice
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Invoices'
    }
  }
}
