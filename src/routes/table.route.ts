import express from 'express'
import { USER_ROLE } from '~/constants/enum'
import {
  createTableController,
  deleteTableController,
  getAllTableController,
  updateTableController,
  updateTableStatusController
} from '~/controllers/table.controler'
import { authMiddleware, roleMiddleware } from '~/middlewares/auth'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Tables
 *     description: Quản lý bàn trong quán
 *
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6705a23b1a2bcd5678ef9012
 *         table_name:
 *           type: string
 *           description: Tên của bàn
 *           example: Bàn số 1
 *         qr_code:
 *           type: string
 *           description: Mã QR của bàn
 *           example: QR001
 *         status:
 *           type: string
 *           description: Trạng thái của bàn
 *           enum: [available, occupied, reserved, maintenance]
 *           example: available
 *         capacity:
 *           type: number
 *           description: Sức chứa của bàn (số ghế)
 *           example: 4
 *
 * /tables:
 *   get:
 *     summary: Lấy danh sách bàn
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Tìm kiếm bàn theo tên
 *         required: false
 *         schema:
 *           type: string
 *           example: Bàn VIP
 *       - name: status
 *         in: query
 *         description: Lọc bàn theo trạng thái (available, occupied, reserved, maintenance)
 *         required: false
 *         schema:
 *           type: string
 *           example: available
 *     responses:
 *       200:
 *         description: Danh sách bàn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Table'
 *
 *   post:
 *     summary: Tạo bàn mới
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       201:
 *         description: Tạo bàn thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *
 * /tables/{id}:
 *   patch:
 *     summary: Cập nhật thông tin bàn
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 6705a23b1a2bcd5678ef9012
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       200:
 *         description: Cập nhật bàn thành công
 *
 *   delete:
 *     summary: Xóa bàn
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa bàn thành công
 *
 * /tables/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái bàn
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 6705a23b1a2bcd5678ef9012
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, occupied, reserved, maintenance]
 *                 example: occupied
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái bàn thành công
 */

router.get('/', authMiddleware, getAllTableController)
router.post('/', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), createTableController)
router.patch('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), updateTableController)
router.patch('/:id/status', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), updateTableStatusController)
router.delete('/:id', authMiddleware, deleteTableController)

export default router
