import express from 'express'
import { loginController, registerController, updateGuestInfo } from '~/controllers/auth.controler'
import { authMiddleware } from '~/middlewares/auth'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: API đăng ký và đăng nhập người dùng
 *
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         username:
 *           type: string
 *           example: "phuonganh"
 *         email:
 *           type: string
 *           example: "phuonganhpham11@gmail.com"
 *         password:
 *           type: string
 *           example: "123456"
 *         phone:
 *           type: string
 *           example: "0987654321"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "adminflareon@gmail.com"
 *         password:
 *           type: string
 *           example: "123456789"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "DEFAULT SUCCESS"
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGU1NjY3MTEzMDIyNTllYmEyZWJhOCIsInJvbGUiOjAsImlhdCI6MTc1OTc0NjI2MSwiZXhwIjoxNzU5ODMyNjYxfQ.FJNOfr5i0VhFBF5Cf9K9IhFe3QQzpxsAHuC78r4K5UE"
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "68de566711302259eba2eba8"
 *             username:
 *               type: string
 *               example: "phuonganh"
 *             email:
 *               type: string
 *               example: "phuonganhpham11@gmail.com"
 *             phone:
 *               type: string
 *               example: "0987654321"
 *             role:
 *               type: number
 *               example: 0
 *             createdAt:
 *               type: string
 *               example: "2025-10-02T10:39:35.847Z"
 *             updatedAt:
 *               type: string
 *               example: "2025-10-02T10:39:35.847Z"
 *
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Register success"
 *
 * /auth/login:
 *   post:
 *     summary: Đăng nhập và nhận token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */

/**
 * @swagger
 * /auth/guest/update:
 *   post:
 *     summary: Cập nhật thông tin guest
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []   # nếu dùng Authorization header, hoặc đổi tên nếu dùng x-guest-token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "JohnDoe"
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123"
 *                 username:
 *                   type: string
 *                   example: "JohnDoe"
 *                 phone:
 *                   type: string
 *                   example: "0123456789"
 *                 role:
 *                   type: integer
 *                   example: 0
 *       400:
 *         description: Thông tin gửi lên không hợp lệ
 *       401:
 *         description: Không có quyền truy cập / token không hợp lệ
 */

router.post('/register', registerController)
router.post('/login', loginController)
router.post('/guest/update', authMiddleware, updateGuestInfo)

export default router
