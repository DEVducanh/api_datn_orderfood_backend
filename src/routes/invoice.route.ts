import express from 'express'
import {
  createInvoiceController,
  getAllInvoiceController,
  getDetailInvoiceControler
} from '~/controllers/invoices.controler'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: API quản lý hóa đơn, thanh toán và giao dịch
 */

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Lấy danh sách tất cả hóa đơn
 *     tags: [Invoices]
 *     responses:
 *       200:
 *         description: Lấy danh sách hóa đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       order_id:
 *                         type: string
 *                       user_id:
 *                         type: string
 *                       table_id:
 *                         type: string
 *                       total_amount:
 *                         type: number
 *                       status:
 *                         type: string
 *                         example: paid
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Lỗi server hoặc lỗi cơ sở dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Lấy chi tiết một hóa đơn bao gồm thông tin thanh toán và giao dịch
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hóa đơn cần xem chi tiết
 *     responses:
 *       200:
 *         description: Trả về chi tiết hóa đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     order_id:
 *                       type: string
 *                     total_amount:
 *                       type: number
 *                     status:
 *                       type: string
 *                       example: paid
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     table:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     payment:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                         method:
 *                           type: string
 *                           example: Cash
 *                         amount_paid:
 *                           type: number
 *                           example: 500000
 *                         status:
 *                           type: string
 *                           example: Success
 *                     transaction:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                         type:
 *                           type: string
 *                           example: Cash
 *                         amount_paid:
 *                           type: number
 *                         status:
 *                           type: string
 *                           example: Completed
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: Không tìm thấy hóa đơn
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
 *       500:
 *         description: Lỗi server hoặc lỗi cơ sở dữ liệu
 */

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Tạo hóa đơn mới từ đơn hàng và khởi tạo thanh toán (Cash hoặc VnPay)
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - method
 *             properties:
 *               order_id:
 *                 type: string
 *                 description: ID của hóa đơn
 *               method:
 *                 type: string
 *                 description: Phương thức thanh toán
 *                 enum: [Cash, VnPay]
 *     responses:
 *       201:
 *         description: Tạo hóa đơn và thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice_id:
 *                       type: string
 *                     payment_id:
 *                       type: string
 *                     transaction_id:
 *                       type: string
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ (ví dụ order không tồn tại hoặc chưa hoàn thành)
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
 *       500:
 *         description: Lỗi server hoặc lỗi xử lý logic
 */

router.get('/', getAllInvoiceController)
router.get('/:id', getDetailInvoiceControler)
router.post('/', createInvoiceController)

export default router
