import mongoose, { Schema, Types } from 'mongoose'
import { IOrderItemStatusHistory } from '~/interfaces/order_item_status'

const OrderItemStatusHistorySchema = new Schema<IOrderItemStatusHistory>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    orderitem_id: { type: Schema.Types.ObjectId, ref: 'OrderItem', required: true },
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
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

export default mongoose.model<IOrderItemStatusHistory>('Order_Item_Status_Histories', OrderItemStatusHistorySchema)
