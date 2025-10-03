import express from 'express'
import {
  createDishControler,
  deleteDishControler,
  getAllDishControler,
  getOneDishControler,
  updateDishControler
} from '~/controllers/dish.controler'
const router = express.Router()

router.get('/', getAllDishControler)
router.post('/', createDishControler)
router.get('/:id', getOneDishControler)
router.patch('/:id', updateDishControler)
router.delete('/:id', deleteDishControler)

export default router
