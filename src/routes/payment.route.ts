import express from 'express'
import { createPaymentUrl, vnpayReturn, vnpIpn } from '~/controllers/payment.controler'

const router = express.Router()

router.post('/create-payment', createPaymentUrl)
router.get('/vnpay-return', vnpayReturn)
router.get('/vnpay_ipn', vnpIpn)

export default router
