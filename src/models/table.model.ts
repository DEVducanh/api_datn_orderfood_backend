import mongoose from 'mongoose'
import { TABLE_STATUS } from '~/constants/enum'
import { ITable } from '~/interfaces/table.type'

export const TableSchema = new mongoose.Schema(
  {
    table_name: { type: String, required: true },
    qr_code: { type: String, required: true },
    status: { type: String, enum: TABLE_STATUS, default: TABLE_STATUS.EMTY },
    capacity: { type: Number, required: true }
  },
  { timestamps: false, versionKey: false }
)

export default mongoose.model<ITable>('Table', TableSchema)
