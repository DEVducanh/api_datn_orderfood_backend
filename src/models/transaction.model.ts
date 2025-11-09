import mongoose, { Schema } from 'mongoose'
import { ITransaction } from '~/interfaces/transaction.type'

export const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    payment_id: {
      type: Schema.Types.ObjectId,
      ref: 'Payments',
      required: true
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    invoices_id: {
      type: Schema.Types.ObjectId,
      ref: 'Invoices',
      default: null
    },
    type: {
      type: String
    },
    amount_paid: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Completed', 'Cancelled'],
      default: 'Completed'
    },
    create_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
)

export default mongoose.model<ITransaction>('Transactions', transactionSchema)
