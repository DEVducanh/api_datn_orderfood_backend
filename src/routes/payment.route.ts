import express from 'express'
import { createPaymentUrl, vnpayReturn, vnpIpn } from '~/controllers/payment.controler'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API quản lý thanh toán VNPay
 */

/**
 * @swagger
 * payment/create-payment:
 *   post:
 *     summary: Tạo URL thanh toán VNPay
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Số tiền cần thanh toán (đơn vị VND)
 *                 example: 500000
 *               orderType:
 *                 type: string
 *                 description: Loại đơn hàng
 *                 example: billpayment
 *               orderDescription:
 *                 type: string
 *                 description: Mô tả đơn hàng
 *                 example: Thanh toán đơn hàng #123
 *               bankCode:
 *                 type: string
 *                 description: Mã ngân hàng (nếu chọn)
 *                 example: VNPAYQR
 *               language:
 *                 type: string
 *                 description: Ngôn ngữ giao diện thanh toán
 *                 example: vn
 *     responses:
 *       200:
 *         description: Trả về URL thanh toán VNPay
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 vnpUrl:
 *                   type: string
 *                   description: URL để redirect sang VNPay
 *                   example: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...&vnp_SecureHash=..."
 *       400:
 *         description: Thiếu tham số hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Thiếu tham số amount"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi tạo URL thanh toán"
 */

/**
 * @swagger
 * payment/vnpay-return:
 *   get:
 *     summary: Xử lý callback trả về từ VNPay (vnreturn)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Dữ liệu callback từ VNPay
 *     responses:
 *       200:
 *         description: Kết quả xác nhận thanh toán VNPay
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Thanh toán thành công"
 *       400:
 *         description: Dữ liệu callback không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu callback không hợp lệ"
 *       500:
 *         description: Lỗi server khi xử lý callback
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi xử lý callback VNPay"
 */

router.post('/create-payment', createPaymentUrl)
router.get('/vnpay-return', vnpayReturn)
router.get('/vnpay_ipn', vnpIpn)

export default router
