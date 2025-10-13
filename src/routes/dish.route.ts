import express from 'express'
import { USER_ROLE } from '~/constants/enum'
import {
  createDishControler,
  deleteDishControler,
  getAllDishControler,
  getOneDishControler,
  updateDishControler
} from '~/controllers/dish.controler'
import { authMiddleware, roleMiddleware } from '~/middlewares/auth'
const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Dishes
 *     description: Quản lý món ăn (Dish)
 *
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 68de30fe89a5860870e0c19d
 *         dish_name:
 *           type: string
 *           example: Trà sữa trân châu đường đen
 *         description:
 *           type: string
 *           example: Thức uống được ưa chuộng với vị ngọt dịu và trân châu dai giòn.
 *         price:
 *           type: number
 *           example: 45000
 *         imageUrl:
 *           type: string
 *           example: https://example.com/images/trasua.jpg
 *         status:
 *           type: number
 *           description: 0 - Hết hàng, 1 - Còn hàng
 *           example: 1
 *         category_id:
 *           type: string
 *           example: 68df56811d6f96e6b2b21297
 *
 * /dishes:
 *   get:
 *     summary: Lấy danh sách món ăn
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Từ khóa tìm kiếm theo tên món ăn
 *         required: false
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: Lọc theo trạng thái (0 - hết hàng, 1 - còn hàng)
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: categoryId
 *         in: query
 *         description: Lọc theo ID danh mục
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách món ăn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dish'
 *
 *   post:
 *     summary: Thêm món ăn mới
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       201:
 *         description: Tạo món ăn thành công
 *
 * /dishes/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết món ăn
 *     tags: [Dishes]
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
 *         description: Thông tin món ăn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *
 *   patch:
 *     summary: Cập nhật món ăn
 *     tags: [Dishes]
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
 *             $ref: '#/components/schemas/Dish'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xóa món ăn
 *     tags: [Dishes]
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
 *         description: Xóa thành công
 */

router.get('/', getAllDishControler)
router.get('/:id', getOneDishControler)
router.post('/', createDishControler)
router.patch('/:id', updateDishControler)
router.delete('/:id', deleteDishControler)

export default router
