import { Request, Response } from 'express'
import {
  createInvoiceService,
  getAllInvoiceService,
  getDetailInvoicesService,
  getInvoiceByOrderIdService
} from '~/services/invoices.service'

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

export const getDetailInvoiceControler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await getDetailInvoicesService(id)

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      })
    }

    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating invoice'
    })
  }
}

export const createInvoiceController = async (req: Request, res: Response) => {
  try {
    const { order_id, method } = req.body

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: order_id'
      })
    }

    const result = await createInvoiceService({
      order_id,
      method
    })

    if (!result.success) {
      if (result.message.includes('Completed') || result.message.includes('exists')) {
        return res.status(409).json(result)
      }
      return res.status(500).json(result)
    }

    return res.status(200).json({
      success: true,
      message: 'Invoice, payment, and transaction created successfully',
      data: result.data
    })
  } catch (error: any) {
    console.error('Error in createInvoiceController:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating invoice'
    })
  }
}

export const getInvoiceByOrderId = async (req: Request, res: Response) => {
  const { orderId } = req.params

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: 'Order ID is required'
    })
  }

  const result = await getInvoiceByOrderIdService(orderId)

  if (result.success) {
    return res.status(200).json(result)
  } else {
    return res.status(404).json(result)
  }
}
