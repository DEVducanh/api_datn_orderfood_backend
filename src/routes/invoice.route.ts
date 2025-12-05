import express from 'express'
import {
  createInvoiceController,
  exportPdfControler,
  getAllInvoiceController,
  getDetailInvoiceControler,
  getInvoiceByOrderId,
  getPaidInvoiceByTableAndUserController
} from '~/controllers/invoices.controler'
import { authMiddleware } from '~/middlewares/auth'

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
 *               order_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "69131bc5a2b54005434e617b"
 *                 description: Mảng id của các order để tạo hóa đơn
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
 *                       type: object
 *                     payment_id:
 *                       type: object
 *                     transaction_id:
 *                       type: object
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

/**
 * @swagger
 * /invoices/order/{orderId}:
 *   get:
 *     summary: Lấy chi tiết hóa đơn theo order ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của order
 *     responses:
 *       200:
 *         description: Lấy hóa đơn thành công
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
 *                   example: "Get invoice detail successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     order_id:
 *                       type: string
 *                     user:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     table:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                     total_amount:
 *                       type: number
 *                     status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *                     order_item:
 *                       type: array
 *                       items:
 *                         type: object
 *                     payment:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                         method:
 *                           type: string
 *                         status:
 *                           type: string
 *                         amount_paid:
 *                           type: number
 *                     transaction:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                         status:
 *                           type: string
 *                         type:
 *                           type: string
 *                         amount_paid:
 *                           type: number
 *                         created_at:
 *                           type: string
 *       404:
 *         description: Hóa đơn không tồn tại
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
 *                   example: "Invoice not found for this order"
 */

/**
 * @swagger
 * /invoices/{tableId}:
 *   get:
 *     summary: Lấy hóa đơn đã thanh toán theo bàn và user có trong token
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bàn
 *     responses:
 *       200:
 *         description: Lấy hóa đơn thành công
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
 *                     description: Thông tin hóa đơn đã thanh toán
 *       400:
 *         description: Thiếu tableId hoặc userId
 *       404:
 *         description: Không tìm thấy hóa đơn đã thanh toán
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /invoice/{id}/pdf:
 *   get:
 *     summary: Generate and return PDF URL of an invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the invoice
 *     responses:
 *       200:
 *         description: PDF generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 pdfUrl:
 *                   type: string
 *                   example: "https://res.cloudinary.com/dddsqdalk/image/upload/v1764934382/invoices/invoice123.pdf"
 *       404:
 *         description: Invoice not found
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
 *                   example: "Invoice not found"
 *       500:
 *         description: Server error
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
 *                   example: "Internal server error"
 */

router.get('/', authMiddleware, getAllInvoiceController)
router.get('/:id', authMiddleware, getDetailInvoiceControler)
router.get('/:id/pdf', exportPdfControler)
router.post('/', authMiddleware, createInvoiceController)
router.get('/order/:orderId', authMiddleware, getInvoiceByOrderId)
router.get('/:tableId', authMiddleware, getPaidInvoiceByTableAndUserController)

export default router
