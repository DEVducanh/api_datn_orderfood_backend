import express from 'express'
import { USER_ROLE } from '~/constants/enum'
import {
  createUserControler,
  deleteUserControler,
  getAllUserControler,
  getOneUserControler,
  updateUserControler
} from '~/controllers/user.controler'
import { authMiddleware, roleMiddleware } from '~/middlewares/auth'

const router = express.Router()
/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Quản lý người dùng (User)
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 68de30fe89a5860870e0c19d
 *         username:
 *           type: string
 *           example: phuonganh
 *         email:
 *           type: string
 *           example: phuonganh@gmail.com
 *         password:
 *           type: string
 *           example: 123456
 *           writeOnly: true
 *         phone:
 *           type: string
 *           example: 0987654321
 *         role:
 *           type: number
 *           description: Vai trò người dùng (0 - Customer, 1 - Waiter, 2 - Cashier, 3 - Chef, 4 - Admin)
 *           example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-02T07:59:58.028Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-10-02T07:59:58.028Z
 *
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 *   post:
 *     summary: Tạo mới người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: chef01
 *               email:
 *                 type: string
 *                 example: chef01@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               phone:
 *                 type: string
 *                 example: 0988888888
 *               role:
 *                 type: number
 *                 description: Vai trò người dùng (0 - Customer, 1 - Waiter, 2 - Cashier, 3 - Chef, 4 - Admin)
 *                 example: 3
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Tạo người dùng thất bại (ví dụ vai trò đã tồn tại)
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
 *                   example: Vai trò này (4) đã có tài khoản, không thể tạo thêm.
 *
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Users]
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
 *         description: Chi tiết người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *   patch:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi cập nhật người dùng
 *
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [Users]
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
 *         description: Xóa người dùng thành công
 *       400:
 *         description: Lỗi khi xóa người dùng
 */

router.get('/', getAllUserControler)
router.post('/', createUserControler)
router.get('/:id', getOneUserControler)
router.post('/', createUserControler)
router.patch('/:id', updateUserControler)
router.delete('/:id', deleteUserControler)

export default router
