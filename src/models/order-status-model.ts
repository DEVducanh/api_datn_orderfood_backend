import mongoose, { Schema, Types } from 'mongoose'

import { IOrderStatusHistory } from '~/interfaces/order_status_history'

const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    order_id: { type: Schema.Types.ObjectId, ref: 'Orders', required: true },
    changed_by: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    old_status: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
    },
    new_status: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
    },

    changed_at: {
      type: Date,
      required: true,
      default: Date.now
    },
    note: {
      type: String,
      default: null
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

export default mongoose.model<IOrderStatusHistory>('OrderStatusHistory', OrderStatusHistorySchema)
