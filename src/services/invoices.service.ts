import { ORDER_STATUS, PAYMENT_METHOD, STATUS_INVOICES, STATUS_PAYMENTS } from '~/constants/enum'
import Invoices from '../models/invoices.model'
import Order from '../models/order.model'
import User from '../models/user.model'
import Table from '../models/table.model'
import OrderItem from '../models/order-item.model'
import Payments from '../models/payment.model'
import Transactions from '../models/transaction.model'

export const getAllInvoiceService = async () => {
  try {
    const invoices = await Invoices.find()
      .populate('user_id', 'username') // chỉ lấy field name từ user
      .populate('table_id', 'table_name')

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

export const getDetailInvoicesService = async (id: string) => {
  try {
    const invoice = await Invoices.findById(id)

    if (!invoice) {
      return {
        success: false,
        message: 'Invoice not found'
      }
    }

    const order = await Order.findById(invoice.order_id)
    const order_item = await OrderItem.find({ order_id: order?._id })

    const user = invoice.user_id ? await User.findById(invoice.user_id) : null
    const table = invoice.table_id ? await Table.findById(invoice.table_id) : null

    const payment = await Payments.findOne({ invoice_id: invoice._id })

    let transaction = null
    if (payment?._id) {
      transaction = await Transactions.findOne({ payment_id: payment._id })
    }

    const invoiceDetail = {
      _id: invoice._id,
      order_id: invoice.order_id,
      user: user ? { id: user._id, name: user.username, email: user.email } : null,
      table: table ? { id: table._id, name: table.table_name } : null,
      total_amount: invoice.total_amount,
      status: invoice.status,
      created_at: invoice.created_at,
      updated_at: invoice.updated_at,
      order_item: order_item,

      payment: payment
        ? {
            id: payment._id,
            method: payment.method,
            status: payment.status,
            amount_paid: payment.amount_paid
          }
        : null,

      transaction: transaction
        ? {
            id: transaction._id,
            status: transaction.status,
            type: transaction.type,
            amount_paid: transaction.amount_paid,
            created_at: transaction.create_at
          }
        : null
    }

    return {
      success: true,
      message: 'Get invoice detail successfully',
      data: invoiceDetail
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Error Get Invoices'
    }
  }
}

export const createInvoiceService = async (payload: { order_id: string; method?: string }) => {
  try {
    const order = await Order.findById(payload.order_id)

    if (!order) {
      return {
        success: false,
        message: 'Order Không tìm thấy'
      }
    }

    if (order.status !== ORDER_STATUS.COMPLETED) {
      return {
        success: false,
        message: 'Invoice chỉ có thể tạo khi đơn hàng ở trạng thái COMPLETED'
      }
    }

    const existingInvoice = await Invoices.findOne({ order_id: order._id })
    if (existingInvoice) {
      return { success: false, message: 'Invoice already exists for this order' }
    }

    const newInvoice = new Invoices({
      order_id: order._id,
      user_id: order.user_id,
      table_id: order.table_id,
      total_amount: order.total_price,
      status: STATUS_INVOICES.UNPAID,
      created_at: new Date(),
      updated_at: new Date()
    })
    const savedInvoice = await newInvoice.save()

    const isCash = payload.method === PAYMENT_METHOD.CASH

    const newPayment = new Payments({
      invoice_id: savedInvoice._id,
      method: payload.method || PAYMENT_METHOD.CASH,
      amount_paid: order.total_price,
      status: isCash ? STATUS_PAYMENTS.SUCCESS : STATUS_PAYMENTS.FAILED,
      created_at: new Date()
    })
    const savedPayment = await newPayment.save()

    if (isCash) {
      savedInvoice.status = STATUS_INVOICES.PAID
      await savedInvoice.save()
    }

    const newTransaction = new Transactions({
      payment_id: savedPayment._id,
      user_id: order.user_id,
      invoices_id: savedInvoice._id,
      type: payload.method || 'Cash',
      amount_paid: order.total_price,
      status: isCash ? 'Completed' : 'Canceled',
      create_at: new Date()
    })
    const savedTransaction = await newTransaction.save()

    savedPayment.transaction_id = savedTransaction._id
    await savedPayment.save()

    return {
      success: true,
      message: 'Invoice, payment, and transaction created successfully',
      data: {
        invoice: savedInvoice,
        payment: savedPayment,
        transaction: savedTransaction
      }
    }
  } catch (error: any) {
    console.error('Error creating invoice service:', error)
    return {
      success: false,
      message: error.message || 'Error creating invoice'
    }
  }
}

export const updateInvoicePayment = async (order_id: any, method: string) => {
  const invoice = await Invoices.findOne({ order_id })
  if (!invoice) {
    return { success: false, message: 'Invoice không tồn tại' }
  }

  let payment = await Payments.findOne({ invoice_id: invoice._id })
  if (!payment) {
    payment = new Payments({
      invoice_id: invoice._id,
      method: method,
      amount_paid: invoice.total_amount,
      status: STATUS_PAYMENTS.SUCCESS,
      created_at: new Date()
    })
    await payment.save()
  } else {
    payment.status = STATUS_PAYMENTS.SUCCESS
    payment.method = method
    await payment.save()
  }

  invoice.status = STATUS_INVOICES.PAID
  await invoice.save()

  // Tạo transaction
  const transaction = new Transactions({
    payment_id: payment._id,
    user_id: invoice.user_id,
    invoices_id: invoice._id,
    type: method,
    amount_paid: invoice.total_amount,
    status: 'Completed',
    create_at: new Date()
  })
  await transaction.save()

  payment.transaction_id = transaction._id
  await payment.save()

  return {
    success: true,
    message: 'Invoice, payment và transaction đã cập nhật thành công',
    data: { invoice, payment, transaction }
  }
}
