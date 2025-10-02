import express from 'express'
import {
  createUserControler,
  deleteUserControler,
  getAllUserControler,
  getOneUserControler,
  updateUserControler
} from '~/controllers/user.controler'

const router = express.Router()

router.get('/', getAllUserControler)
router.post('/', createUserControler)
router.get('/:id', getOneUserControler)
router.patch('/:id', updateUserControler)
router.delete('/:id', deleteUserControler)

export default router
