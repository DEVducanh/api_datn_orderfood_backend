import { Request, Response, NextFunction } from 'express'
import qs from 'query-string'
import crypto from 'crypto'
import moment from 'moment'
import { updateInvoicePayment } from '~/services/invoices.service'

function sortObject(obj: any) {
  let sorted: Record<string, any> = {}
  let str = []
  let key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}

export const createPaymentUrl = (req: Request, res: Response, next: NextFunction): void => {
  try {
    process.env.TZ = 'Asia/Ho_Chi_Minh'

    let date = new Date()
    let createDate = moment(date).format('YYYYMMDDHHmmss')

    let ipAddr =
      (req.headers['x-forwarded-for'] as string) ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      (req.connection as any)?.socket?.remoteAddress

    let tmnCode: string = process.env.vnp_TmnCode!
    let secretKey: string = process.env.vnp_HashSecret!
    let vnpUrl: string = process.env.vnp_Url!
    let returnUrl: string = process.env.vnp_ReturnUrl!
    let orderId = req.body.order_id
    let amount: number = req.body.amount
    let bankCode: string = req.body.bankCode

    let locale: string = req.body.language
    if (locale === null || locale === '') {
      locale = 'vn'
    }

    let currCode = 'VND'
    let vnp_Params: Record<string, any> = {}
    vnp_Params['vnp_Version'] = '2.1.0'
    vnp_Params['vnp_Command'] = 'pay'
    vnp_Params['vnp_TmnCode'] = tmnCode
    vnp_Params['vnp_Locale'] = locale
    vnp_Params['vnp_CurrCode'] = currCode
    vnp_Params['vnp_TxnRef'] = orderId
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
    vnp_Params['vnp_OrderType'] = 'other'
    vnp_Params['vnp_Amount'] = amount * 100
    vnp_Params['vnp_ReturnUrl'] = returnUrl
    vnp_Params['vnp_IpAddr'] = ipAddr
    vnp_Params['vnp_CreateDate'] = createDate

    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode
    }

    vnp_Params = sortObject(vnp_Params)

    let signData = qs.stringify(vnp_Params, { encode: false })
    let hmac = crypto.createHmac('sha512', secretKey)
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
    vnp_Params['vnp_SecureHash'] = signed
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false })

    console.log(vnpUrl)

    return res.redirect(vnpUrl)
  } catch (error) {
    next(error)
  }
}

export const vnpayReturn = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let vnp_Params = req.query

    let secureHash = vnp_Params['vnp_SecureHash']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = sortObject(vnp_Params)

    let tmnCode = process.env.vnp_TmnCode!
    let secretKey = process.env.vnp_HashSecret!

    let signData = qs.stringify(vnp_Params, { encode: false })
    let crypto = require('crypto')
    let hmac = crypto.createHmac('sha512', secretKey)
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

    if (secureHash === signed) {
      res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
    } else {
      res.render('success', { code: '97' })
    }
  } catch (error) {
    console.log(error)
  }
}

export const vnpIpn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let vnp_Params = req.query
    let secureHash = vnp_Params['vnp_SecureHash']

    let orderId = vnp_Params['vnp_TxnRef']
    let rspCode = vnp_Params['vnp_ResponseCode']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = sortObject(vnp_Params)
    let secretKey = process.env.vnp_HashSecret!

    let signData = qs.stringify(vnp_Params, { encode: false })

    let hmac = crypto.createHmac('sha512', secretKey)
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
    let paymentStatus = '0'

    let checkOrderId = true // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) {
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == '0') {
            if (rspCode == '00') {
              //thanh cong
              //paymentStatus = '1'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
              const result = await updateInvoicePayment(orderId!, 'VNPAY')
              res.status(200).json({ RspCode: '00', Message: 'Success' })
            } else {
              res.status(200).json({ RspCode: '00', Message: 'Success' })
            }
          } else {
            res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' })
          }
        } else {
          res.status(200).json({ RspCode: '04', Message: 'Amount invalid' })
        }
      } else {
        res.status(200).json({ RspCode: '01', Message: 'Order not found' })
      }
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Checksum failed' })
    }
  } catch (error) {}
}
