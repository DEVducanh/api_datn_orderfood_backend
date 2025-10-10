import express from 'express'
import { USER_ROLE } from '~/constants/enum'
import {
  createCategoryControler,
  deleteCategoryControler,
  getAllCategoryControler,
  getOneCategoryControler,
  updateCategoryControler
} from '~/controllers/cate.controler'

import { authMiddleware, roleMiddleware } from '~/middlewares/auth'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Categories
 *     description: Quản lý danh mục sản phẩm (Category)
 *
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 68df56811d6f96e6b2b21297
 *         category_name:
 *           type: string
 *           example: Đồ uống
 *         description:
 *           type: string
 *           example: Các loại nước ngọt, sinh tố, trà sữa và cà phê
 *         imageUrl:
 *           type: string
 *           example: https://example.com/images/do-uong.jpg
 *         status:
 *           type: number
 *           description: 0 - Inactive, 1 - Active
 *           example: 1
 *
 * /category:
 *   get:
 *     summary: Lấy danh sách danh mục
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Từ khóa tìm kiếm danh mục (tìm theo tên)
 *         required: false
 *         schema:
 *           type: string
 *           example: đồ uống
 *       - name: status
 *         in: query
 *         description: Lọc theo trạng thái (0 - không hoạt động, 1 - hoạt động)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: page
 *         in: query
 *         description: Trang hiện tại (phân trang)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *
 * /category/{id}:
 *   get:
 *     summary: Lấy thông tin 1 danh mục theo ID
 *     tags: [Category]
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
 *         description: Thông tin danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *
 *   patch:
 *     summary: Cập nhật danh mục
 *     tags: [Category]
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Category]
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
 *         description: Xóa danh mục thành công
 */

router.get('/', authMiddleware, getAllCategoryControler)
router.get('/:id', authMiddleware, getOneCategoryControler)
router.post('/', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), createCategoryControler)
router.patch('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), updateCategoryControler)
router.delete('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), deleteCategoryControler)

export default router
