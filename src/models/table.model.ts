import mongoose from 'mongoose'
import { TABLE_STATUS } from '~/constants/enum'
import { ITable } from '~/interfaces/table.type'

export const TableSchema = new mongoose.Schema(
  {
    table_name: { type: String, required: true, unique: true }, // Tên bàn
    qr_code: { type: String, required: true, unique: true }, // Mã QR của bàn
    status: { type: String, enum: TABLE_STATUS, default: TABLE_STATUS.EMPTY }, // Trạng thái bàn
    capacity: { type: Number, required: true, default: 6 } // Sức chứa của bàn
  },
  { timestamps: true }
)

export const Table = mongoose.model<ITable>('Table', TableSchema)
