import { TABLE_STATUS } from '~/constants/enum'

export interface ITable {
  table_name: string
  qr_code: string
  status: TABLE_STATUS
  capacity: number
}
