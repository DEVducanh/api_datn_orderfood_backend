import mongoose, { Schema } from 'mongoose'
import { ICart, ICart_item } from '~/interfaces/cart.type'

export const CartSchema = new mongoose.Schema<ICart>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: false },
    table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    order_id: { type: Schema.Types.ObjectId, ref: 'Orders', required: false },
    total_price: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
)
export const Cart = mongoose.model<ICart>('Carts', CartSchema)

export const CartItemSchema = new mongoose.Schema<ICart_item>(
  {
    cart_id: { type: Schema.Types.ObjectId, ref: 'Carts', required: true },
    dish_id: { type: Schema.Types.ObjectId, ref: 'Dishes', required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    subtotal: { type: Number, default: 0 },
    note: { type: String }
  },
  { versionKey: false }
)

CartItemSchema.pre('save', function (next) {
  this.subtotal = this.price * this.quantity
  next()
})

export const Cart_Item = mongoose.model<ICart_item>('Cart_Items', CartItemSchema)
// export default mongoose.model<ICart>('Carts', CartSchema)
