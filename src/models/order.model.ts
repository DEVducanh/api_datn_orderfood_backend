import dayjs from 'dayjs'
import mongoose, { Schema } from 'mongoose'
import { ORDER_STATUS } from '~/constants/enum'
import { IOrder } from '~/interfaces/order.type'

export const OrderSchema = new mongoose.Schema<IOrder>(
  {
    table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    status: {
      type: String,
      enum: ORDER_STATUS,
      required: true,
      default: ORDER_STATUS.PENDING
    },
    total_price: { type: Number, required: true, default: 0 },
    createdAt: {
      type: String,
      default: () => dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    updatedAt: {
      type: String,
      default: () => dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  { versionKey: false }
)

OrderSchema.pre('save', function (next) {
  this.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})

OrderSchema.pre(['findOneAndUpdate'], function (next) {
  this.set({ updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') })
  next()
})

export default mongoose.model<IOrder>('Orders', OrderSchema)
