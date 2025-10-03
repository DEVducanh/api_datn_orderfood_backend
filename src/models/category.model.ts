import mongoose from 'mongoose'
import { CATEGORY_STATUS } from '~/constants/enum'
import { ICategory } from '~/interfaces/category.interface'

export const CategorySchema = new mongoose.Schema(
  {
    category_name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    status: {
      type: Number,
      enum: CATEGORY_STATUS, // chỉ cho phép giá trị trong enum
      required: true,
      default: CATEGORY_STATUS.ACTIVE
    }
  },
  { timestamps: false, versionKey: false }
)

export default mongoose.model<ICategory>('Category', CategorySchema)
