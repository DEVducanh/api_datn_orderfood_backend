import mongoose from 'mongoose'
import { CATEGORY_STATUS } from '~/constants/enum'
import { ICategory } from '~/interfaces/category.type'

export const CategorySchema = new mongoose.Schema<ICategory>(
  {
    category_name: { type: String, required: true },
    description: { type: String },
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
