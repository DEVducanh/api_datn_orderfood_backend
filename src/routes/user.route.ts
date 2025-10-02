import express from 'express'
import { createUserControler } from '~/controllers/user.controler'

const router = express.Router()

router.post('/', createUserControler)

export default router
