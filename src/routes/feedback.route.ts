import express from 'express'
import {
  createFeedBackControler,
  getAllFeedBackControler,
  getDetailFeedbackControler,
  getFeedBackByDishIdControler
} from '~/controllers/feedback.controler'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: API quản lý Feedback (đánh giá, góp ý, khiếu nại món ăn)
 *
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       description: Mô hình dữ liệu của một feedback (đánh giá hoặc góp ý của người dùng)
 *       properties:
 *         _id:
 *           type: string
 *           description: ID tự động sinh của feedback
 *           example: "67201ad9b76e2b1f9c56a91a"
 *         user_id:
 *           type: string
 *           description: ID người dùng gửi feedback (tham chiếu đến bảng Users)
 *           example: "671fc9c2d9993b183f37b6f3"
 *         order_id:
 *           type: string
 *           description: ID đơn hàng liên quan đến feedback (tham chiếu đến bảng Orders)
 *           example: "671fc9c2d9993b183f37b6f4"
 *         dish_id:
 *           type: string
 *           description: ID món ăn được đánh giá (tham chiếu đến bảng Dishes)
 *           example: "671fc9c2d9993b183f37b6f5"
 *         type:
 *           type: string
 *           enum: [normal, complaint, suggestion]
 *           description: Loại feedback — bình thường, khiếu nại hoặc góp ý
 *           example: "normal"
 *         rating:
 *           type: number
 *           description: Điểm đánh giá món ăn (1–5)
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         content:
 *           type: string
 *           description: Nội dung chi tiết của feedback
 *           example: "Món ăn rất ngon, phục vụ nhanh và nhiệt tình!"
 *         image:
 *           type: string
 *           nullable: true
 *           description: Đường dẫn ảnh minh họa (nếu có)
 *           example: "https://example.com/uploads/feedback_001.jpg"
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Trạng thái xử lý của feedback
 *           example: "pending"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo feedback
 *           example: "2025-11-01T10:15:30.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật feedback
 *           example: "2025-11-01T10:15:30.000Z"
 */

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Lấy danh sách tất cả feedback
 *     description: Trả về danh sách tất cả feedback trong hệ thống, bao gồm cả pending, approved và rejected.
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Lấy danh sách feedback thành công
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
 *                     $ref: '#/components/schemas/Feedback'
 *       500:
 *         description: Lỗi server khi lấy danh sách feedback
 */

/**
 * @swagger
 * /feedback/{id}:
 *   get:
 *     summary: Lấy chi tiết một feedback theo ID
 *     description: Trả về thông tin chi tiết của một feedback dựa vào ID.
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của feedback cần xem chi tiết
 *     responses:
 *       200:
 *         description: Lấy thông tin feedback thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Không tìm thấy feedback
 *       500:
 *         description: Lỗi server khi lấy chi tiết feedback
 */

/**
 * @swagger
 * /feedback/dish/{dish_id}:
 *   get:
 *     summary: Lấy danh sách feedback theo ID món ăn
 *     description: Trả về toàn bộ feedback của một món ăn cụ thể theo `dish_id`.
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: dish_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID món ăn để lọc feedback
 *     responses:
 *       200:
 *         description: Lấy danh sách feedback theo món ăn thành công
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
 *                     $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Không có feedback nào cho món ăn này
 *       500:
 *         description: Lỗi server khi lấy feedback theo món
 */

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Tạo mới một feedback
 *     description: API cho phép người dùng tạo một feedback mới, bao gồm điểm đánh giá, nội dung và hình ảnh (tùy chọn).
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, order_id, dish_id, type, rating, content]
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID người dùng gửi feedback
 *                 example: "671fc9c2d9993b183f37b6f3"
 *               order_id:
 *                 type: string
 *                 description: ID đơn hàng liên quan đến feedback
 *                 example: "671fc9c2d9993b183f37b6f4"
 *               dish_id:
 *                 type: string
 *                 description: ID món ăn được đánh giá
 *                 example: "671fc9c2d9993b183f37b6f5"
 *               type:
 *                 type: string
 *                 enum: [normal, complaint, suggestion]
 *                 description: Loại feedback (bình thường, khiếu nại hoặc góp ý)
 *                 example: "normal"
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Điểm đánh giá món ăn (1–5)
 *                 example: 4
 *               content:
 *                 type: string
 *                 description: Nội dung đánh giá hoặc nhận xét của người dùng
 *                 example: "Món ăn ngon nhưng phục vụ hơi chậm."
 *               image:
 *                 type: string
 *                 nullable: true
 *                 description: Đường dẫn ảnh minh họa (tùy chọn)
 *                 example: "https://example.com/uploads/feedback_001.jpg"
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: Trạng thái của feedback (mặc định là pending)
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Tạo feedback thành công
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
 *                   example: "Feedback created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi tạo feedback
 */

router.get('/', getAllFeedBackControler)
router.get('/:id', getDetailFeedbackControler)
router.get('/dish/:dish_id', getFeedBackByDishIdControler)
router.post('/', createFeedBackControler)

export default router
