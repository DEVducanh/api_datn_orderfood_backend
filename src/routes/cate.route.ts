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

router.get('/', authMiddleware, getAllCategoryControler)
router.get('/:id', authMiddleware, getOneCategoryControler)
router.post('/', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), createCategoryControler)
router.patch('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), updateCategoryControler)
router.delete('/:id', authMiddleware, roleMiddleware([USER_ROLE.ADMIN]), deleteCategoryControler)

export default router
