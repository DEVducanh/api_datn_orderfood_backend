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

router.get('/', authMiddleware, getAllUserControler)
router.get('/:id', authMiddleware, getOneUserControler)
router.post('/', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), createUserControler)
router.patch('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), updateUserControler)
router.delete('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), deleteUserControler)

export default router
