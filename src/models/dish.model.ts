import mongoose, { Schema } from 'mongoose'
import { DISHES_STATUS } from '~/constants/enum'
import { IDishes } from '~/interfaces/dish.type'

export const DishSchema = new mongoose.Schema<IDishes>(
  {
    dish_name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: DISHES_STATUS, // chỉ cho phép giá trị trong enum
      required: true,
      default: DISHES_STATUS.AVAILABLE
    },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
  },
  { timestamps: false, versionKey: false }
)

export default mongoose.model<IDishes>('Dishes', DishSchema)
