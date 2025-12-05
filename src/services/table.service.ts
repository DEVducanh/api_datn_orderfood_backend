import { ITable } from '~/interfaces/table.type'
import Table from '../models/table.model'
import { TABLE_STATUS } from '~/constants/enum'

export const getAllTableService = async (search?: string, status?: string, page: number = 1, limit: number = 10) => {
  try {
    const query: any = {}
    if (search) {
      query.table_name = { $regex: search, $options: 'i' }
    }

    // lọc theo status
    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([Table.find(query).skip(skip).limit(limit), Table.countDocuments(query)])

    return {
      data,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    throw new Error('cannot get all Table')
  }
}

export const createTableService = async (data: ITable): Promise<ITable> => {
  try {
    const newTable = await new Table(data).save()
    return newTable
  } catch (error) {
    throw new Error('cannot create Table')
  }
}

export const updateTableService = async (id: string, data: ITable) => {
  try {
    const updateTable = await Table.findByIdAndUpdate(id, data, { new: true })
    return updateTable
  } catch (error) {
    throw new Error('cannot update Table')
  }
}

export const updateStatusTableService = async (id: string, status: TABLE_STATUS) => {
  try {
    const table = await Table.findById(id)
    if (!table) {
      throw new Error('Không tìm thấy Bàn')
    }

    if (table.status === TABLE_STATUS.OCCUPIED && status === TABLE_STATUS.OCCUPIED) {
      throw new Error('Bàn đã có người ngồi')
    }

    table.status = status
    await table.save()

    return table
  } catch (error) {
    throw new Error('cannot update Status Table')
  }
}

export const deleteTableService = async (id: string) => {
  try {
    const table = await Table.findById(id)
    if (!table) {
      throw new Error('Không tìm thấy bàn!')
    }

    if (table.status === TABLE_STATUS.OCCUPIED) {
      throw new Error('Bàn đang có người ngồi không thể xóa!')
    }
    await Table.findByIdAndDelete(id)
    return { mesage: 'Table Delete Success' }
  } catch (error) {
    throw new Error('Error Delete table', { cause: error })
  }
}
