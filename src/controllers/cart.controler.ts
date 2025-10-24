import { Request, Response } from 'express'
import { createCartService } from '~/services/cart.service'

export const createCartController = async (req: Request, res: Response) => {
  try {
    const { user_id, table_id } = req.body

    if (!user_id || !table_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing user_id or table_id'
      })
    }

    // Gọi service
    const cart = await createCartService(user_id, table_id)

    return res.status(200).json({
      success: true,
      message: 'Cart created or updated successfully',
      data: cart
    })
  } catch (error: any) {
    console.error(' Error in createCartController:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    })
  }
}
