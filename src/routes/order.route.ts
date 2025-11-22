import express from 'express'
import { USER_ROLE } from '~/constants/enum'
import {
  createOrderControler,
  deleteOrderControler,
  getAllOrderControler,
  getDetailOrderByTableIdController,
  getOrderByTableController,
  updateOrderControler,
  updateOrderStatusController
} from '~/controllers/order.controler'
import { authMiddleware, roleMiddleware } from '~/middlewares/auth'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: Quản lý đơn hàng
 *
 * /orders:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: READY
 *         description: Lọc theo trạng thái đơn hàng
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Bàn 4 || ducanh1925
 *         description: tìm kiếm đơn hàng
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *       400:
 *         description: Lỗi truy vấn
 *
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table_id:
 *                 type: string
 *                 example: "6521e5c4b3c7e4a2b9f7a101"
 *               user_id:
 *                 type: string
 *                 example: "6521e5c4b3c7e4a2b9f7a201"
 *               status:
 *                 type: string
 *                 example: "PENDING"
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *
 * /orders/{tableId}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng theo ID bàn
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bàn
 *     responses:
 *       200:
 *         description: Lấy chi tiết đơn hàng thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 * /orders/{id}:
 *   patch:
 *     summary: Cập nhật thông tin đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table_id:
 *                 type: string
 *                 example: "6521e5c4b3c7e4a2b9f7a101"
 *               user_id:
 *                 type: string
 *                 example: "6521e5c4b3c7e4a2b9f7a201"
 *               status:
 *                 type: string
 *                 example: "READY"
 *     responses:
 *       200:
 *         description: Cập nhật đơn hàng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 *   delete:
 *     summary: Xóa đơn hàng theo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần xóa
 *     responses:
 *       200:
 *         description: Xóa đơn hàng thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 *
 * /orders/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái của đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 */

/**
 * @swagger
 * /orders/table/{tableId}:
 *   get:
 *     summary: Lấy danh sách tất cả order theo bàn (và user nếu có)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của bàn cần lấy order
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID của người dùng (nếu muốn lọc theo user)
 *     responses:
 *       200:
 *         description: Lấy danh sách order thành công
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
 *                   example: Lấy danh sách đơn hàng thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 69131bc5a2b54005434e617b
 *                       table_id:
 *                         type: string
 *                         example: 690e42bc597fefc62ae5f6e1
 *                       user_id:
 *                         type: string
 *                         example: 69131b98a2b54005434e613c
 *                       status:
 *                         type: string
 *                         example: Completed
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-11-12T08:15:00Z
 *       400:
 *         description: tableId không hợp lệ
 *       500:
 *         description: Lỗi server
 */

router.get('/', getAllOrderControler)
router.get('/:tableId', getDetailOrderByTableIdController)
router.get('/table/:tableId', getOrderByTableController)
router.post('/', createOrderControler)
router.patch('/:id', updateOrderControler)
router.patch('/:id/status', updateOrderStatusController)
router.delete('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), deleteOrderControler)

export default router
