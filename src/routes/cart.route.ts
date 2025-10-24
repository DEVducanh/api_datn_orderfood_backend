import express from 'express'
import { createCartController } from '~/controllers/cart.controler'

const router = express.Router()

router.post('/', createCartController)

export default router
