import { Request, Response } from 'express'

import {
  createInvoiceService,
  getAllInvoiceService,
  getDetailInvoicesService,
  getInvoiceByOrderIdService,
  getPaidInvoiceByTableAndUserService
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
    const payload = req.body
    const result = await createInvoiceService(payload)
    return res.status(result.success ? 200 : 400).json(result)
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error })
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

export const getPaidInvoiceByTableAndUserController = async (req: Request, res: Response) => {
  try {
    const { tableId, userId } = req.params

    if (!tableId) return res.status(400).json({ success: false, message: 'Thiếu tableId' })

    const result = await getPaidInvoiceByTableAndUserService(tableId, userId)

    if (!result)
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hóa đơn đã thanh toán'
      })

    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    })
  }
}
