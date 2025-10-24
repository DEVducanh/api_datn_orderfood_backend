import dayjs from 'dayjs'
import mongoose, { Schema } from 'mongoose'
import { STATUS_FEEDBACK, TYPE_FEEDBACK } from '~/constants/enum'
import { IFeedback } from '~/interfaces/feedback.type'

export const feedBackSchema = new mongoose.Schema<IFeedback>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    order_id: { type: Schema.Types.ObjectId, ref: 'Orders', required: true },
    dish_id: { type: Schema.Types.ObjectId, ref: 'Dishes', required: true },
    type: {
      type: String,
      enum: TYPE_FEEDBACK,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: STATUS_FEEDBACK,
      required: true,
      default: STATUS_FEEDBACK.PENDING
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  { versionKey: false }
)

export default mongoose.model<IFeedback>('FeedBacks', feedBackSchema)
