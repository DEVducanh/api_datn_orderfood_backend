import express from 'express'
import { USER_ROLE } from '~/constants/enum'
import {
  cancelOrderItemController,
  getHistoryOrderItemController,
  getOrderItemControler,
  getOrderItemsByUserOrTableController,
  updateManyOrderItemsController,
  updateSttOderItemControler
} from '~/controllers/order-item.controler'
import { authMiddleware, roleMiddleware } from '~/middlewares/auth'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Order Items
 *   description: Quản lý các món ăn trong đơn hàng (OrderItem)
 *
 * /order-item/order/{orderId}:
 *   get:
 *     summary: Lấy danh sách món trong một đơn hàng cụ thể
 *     description: |
 *       Trả về danh sách các món (`OrderItem`) thuộc về một **đơn hàng cụ thể**.
 *       Mỗi món bao gồm thông tin chi tiết như tên món, giá, số lượng và trạng thái.
 *     tags: [Order Items]
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID của đơn hàng
 *         schema:
 *           type: string
 *           example: "68fef987e37e3fde60fce2e4"
 *     responses:
 *       200:
 *         description: Danh sách món trong đơn hàng
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
 *                   example: Lấy danh sách món trong đơn hàng thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "671fc9c2d9993b183f37b6f8"
 *                       dish_id:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Cơm gà xối mỡ"
 *                           price:
 *                             type: number
 *                             example: 45000
 *                       quantity:
 *                         type: number
 *                         example: 2
 *                       status:
 *                         type: string
 *                         enum: [Pending, Processing, Ready, Served, Cancelled]
 *                         example: "Processing"
 *       404:
 *         description: Không tìm thấy đơn hàng hoặc không có món ăn nào
 *       500:
 *         description: Lỗi server
 *
 * /order-item/table:
 *   get:
 *     summary: Lấy danh sách món ăn theo table_id
 *     description: |
 *       API linh hoạt cho phép lấy danh sách món ăn đã gọi:
 *     tags: [Order Items]
 *     parameters:
 *       - in: query
 *         name: table_id
 *         schema:
 *           type: string
 *         description: ID bàn
 *     responses:
 *       200:
 *         description: Lấy danh sách món ăn đã đặt thành công
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
 *                   example: Lấy danh sách món ăn theo user_id hoặc table_id thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dish_id:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Phở bò tái"
 *                           price:
 *                             type: number
 *                             example: 40000
 *                       quantity:
 *                         type: number
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: "Served"
 *       400:
 *         description: Thiếu user_id hoặc table_id
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /order-item/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái món ăn trong đơn hàng
 *     description: |
 *       Cập nhật **trạng thái của từng món ăn** (`OrderItem`) trong đơn hàng.
 *       Quy trình hợp lệ: `Pending → Processing → Ready → Served`.
 *       Có thể **hủy (Cancelled)** ở bất kỳ giai đoạn nào, trừ khi món đã **Served** hoặc **đã Cancelled**.
 *
 *       **Phân quyền:**
 *       - `CUSTOMER`: chỉ có thể hủy món (`Cancelled`) nếu món chưa Processing.
 *       - `WAITER`: có thể chuyển từ `Ready → Served` hoặc hủy món.
 *       - `CHEF`: có thể chuyển trạng thái theo quy trình `Pending → Processing → Ready` và hủy món nếu chưa Served.
 *     tags: [Order Items]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của món ăn trong đơn hàng (order_item_id)
 *         schema:
 *           type: string
 *           example: "68fef987e37e3fde60fce2e6"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Processing, Ready, Served, Cancelled]
 *                 example: "Processing"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
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
 *                   example: "Order item status updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68fef987e37e3fde60fce2e6"
 *                     status:
 *                       type: string
 *                       example: "Ready"
 *       400:
 *         description: Trạng thái không hợp lệ hoặc chuyển trạng thái không hợp lệ
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
 *                   example: "Invalid status transition"
 *       401:
 *         description: Người dùng chưa đăng nhập hoặc token không hợp lệ
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
 *                   example: "Unauthorized: User not logged in"
 *       403:
 *         description: Người dùng không đủ quyền cập nhật trạng thái
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
 *                   example: "Forbidden: You do not have permission to update this status"
 *       404:
 *         description: Không tìm thấy order item
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
 *                   example: "Order item not found"
 *       500:
 *         description: Lỗi server khi cập nhật trạng thái
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

/**
 * @swagger
 * /order-item/{id}/history:
 *   get:
 *     summary: Lấy lịch sử thay đổi của món ăn
 *     description: Lấy tất cả bản ghi **lịch sử thay đổi** của một `OrderItem` dựa theo `id`. Bao gồm trạng thái cũ, trạng thái mới, và thông tin người thay đổi.
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của OrderItem cần lấy lịch sử
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy lịch sử thành công
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
 *                       orderItemId:
 *                         type: string
 *                         example: "652a8f9b1234567890abcd12"
 *                       status:
 *                         type: string
 *                         example: "PROCESSING"
 *                       changedBy:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "652a8f9b1234567890abcd34"
 *                           name:
 *                             type: string
 *                             example: "Nguyen Van A"
 *                           role:
 *                             type: number
 *                             example: 2
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-20T12:34:56.789Z"
 *       400:
 *         description: Thiếu ID của OrderItem
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
 *                   example: "Thiếu orderItemId"
 *       500:
 *         description: Lỗi server khi lấy lịch sử
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
 *                   example: "Lỗi khi lấy lịch sử món ăn"
 */

/**
 * @swagger
 * /order-item/{id}/cancel:
 *   patch:
 *     summary: Hủy Món ăn theo ID
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Món ăn cần hủy
 *     responses:
 *       200:
 *         description: Hủy thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy Món ăn
 *       500:
 *         description: Lỗi server
 *
 * /order-item/orderitem-many:
 *   patch:
 *     summary: Cập nhật trạng thái nhiều order item trong một đơn hàng
 *     description: |
 *       API cho phép cập nhật trạng thái của nhiều order item cùng lúc.
 *       Hệ thống sẽ kiểm tra phân quyền dựa trên role và luật chuyển trạng thái.
 *     tags: [Order Items]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - orderItemIds
 *               - newStatus
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID của đơn hàng chứa các order item cần cập nhật
 *                 example: "68fef987e37e3fde60fce2e4"
 *               orderItemIds:
 *                 type: array
 *                 description: Danh sách ID của order item cần cập nhật
 *                 items:
 *                   type: string
 *                 example: ["item123", "item456", "item789"]
 *               newStatus:
 *                 type: string
 *                 description: Trạng thái mới
 *                 enum:
 *                   - Pending
 *                   - Processing
 *                   - Ready
 *                   - Served
 *                   - Cancelled
 *                 example: "Processing"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 updatedCount:
 *                   type: number
 *                   example: 3
 *                 message:
 *                   type: string
 *                   example: "Updated 3 order items successfully"
 *       400:
 *         description: Dữ liệu đầu vào sai hoặc không hợp lệ
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền cập nhật trạng thái
 *       404:
 *         description: Không tìm thấy item
 *       500:
 *         description: Lỗi server
 */

router.get('/order/:orderId', authMiddleware, getOrderItemControler)
router.get('/table', authMiddleware, getOrderItemsByUserOrTableController)
router.patch('/:id/cancel', authMiddleware, cancelOrderItemController)
router.get('/:id/history', authMiddleware, getHistoryOrderItemController)
router.patch('/orderitem-many', authMiddleware, updateManyOrderItemsController)
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware([USER_ROLE.ADMIN, USER_ROLE.CHEF, USER_ROLE.WAITER]),
  updateSttOderItemControler
)

export default router
