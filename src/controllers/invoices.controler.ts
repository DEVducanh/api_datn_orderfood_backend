import { Request, Response } from 'express'
import { createInvoiceService, getAllInvoiceService } from '~/services/invoices.service'

export const getAllInvoiceController = async (req: Request, res: Response) => {
  try {
    const result = await getAllInvoiceService()

    if (!result.success) {
      return res.status(500).json(result)
    }

    // Nếu có dữ liệu
    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server Error Get All Invoices'
    })
  }
}

export const createInvoiceController = async (req: Request, res: Response) => {
  try {
    const { user_id, table_id, order_id, total_amount } = req.body

    if (!table_id || !order_id || !total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    const result = await createInvoiceService({
      user_id: user_id || null,
      table_id,
      order_id,
      total_amount
    })

    if (!result.success) {
      return res.status(500).json(result)
    }

    return res.status(201).json(result)
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating invoice'
    })
  }
}
