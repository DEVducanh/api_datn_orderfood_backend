import express from 'express'
import { createInvoiceController, getAllInvoiceController } from '~/controllers/invoices.controler'

const router = express.Router()

router.get('/', getAllInvoiceController)
router.post('/', createInvoiceController)

export default router
