import mongoose from 'mongoose'
import { USER_ROLE } from '~/constants/enum'
import { IUser } from '~/interfaces/user.type'

export const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: Number,
      enum: USER_ROLE, // chỉ cho phép giá trị trong enum
      required: true,
      default: USER_ROLE.CUSTOMER
    }
  },
  { timestamps: true, versionKey: false }
)

export default mongoose.model<IUser>('Users', UserSchema)
