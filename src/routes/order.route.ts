import express from 'express'
import {
  createOrderControler,
  deleteOrderController,
  getAllOrderControler,
  getDetailOrderByTableIdController,
  updateOrderControler,
  updateOrderStatusController
} from '~/controllers/order.controler'

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
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Giới hạn số đơn hàng mỗi trang
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
 *           example: "Ban 1"
 *         description: Tìm kiếm theo tên bàn hoặc tên người dùng
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
 *     summary: Xóa đơn hàng
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đơn hàng đã được xóa thành công"
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
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
 *                 example: "COMPLETED"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 */

router.get('/', getAllOrderControler)
router.get('/:tableId', getDetailOrderByTableIdController)
router.post('/', createOrderControler)
router.patch('/:id', updateOrderControler)
router.delete('/:id', deleteOrderController)
router.patch('/:id/status', updateOrderStatusController)

export default router
