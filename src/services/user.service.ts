import { IUser } from '~/interfaces/user.type'
import User from '../models/user.model'
import { USER_ROLE } from '~/constants/enum'

export const getAllUserService = async () => {
  try {
    const users = await User.find()
    return users
  } catch (error) {
    throw new Error('Cannot get User')
  }
}

export const getOneUserService = async (id: string) => {
  try {
    const users = await User.findById(id)
    return users
  } catch (error) {
    throw new Error(`Cannot get User by id : ${id}`)
  }
}

export const createUserService = async (data: IUser): Promise<IUser> => {
  try {
    data.role = Number(data.role)
    if ([USER_ROLE.CASHIER, USER_ROLE.CHEF, USER_ROLE.ADMIN].includes(data.role)) {
      const existingUser = await User.findOne({ role: data.role })
      if (existingUser) {
        throw new Error(`Vai trò này (${data.role}) đã có tài khoản, không thể tạo thêm.`)
      }
    }
    const newUser = new User(data)
    await newUser.save()
    return newUser
  } catch (error: any) {
    throw new Error(error.message || 'Cannot create User')
  }
}

export const UpdateUserService = async (id: string, data: IUser) => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new Error('Người dùng không tồn tại')
    }

    if (user.role === USER_ROLE.CUSTOMER) {
      throw new Error('Không được phép sửa tài khoản khách hàng')
    }

    const newUser = await User.findByIdAndUpdate(id, data)
    return newUser
  } catch (error: any) {
    throw new Error(error.message || 'Cannot Update User')
  }
}

export const deleteUserService = async (id: string) => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new Error('Người dùng không tồn tại')
    }

    if (user.role === USER_ROLE.ADMIN) {
      throw new Error('Không được phép xóa tài khoản quản trị viên')
    }

    if (user.role === USER_ROLE.CUSTOMER) {
      throw new Error('Không được phép xóa tài khoản khách hàng')
    }

    await User.findByIdAndDelete(id)

    return { message: 'Xóa người dùng thành công' }
  } catch (error: any) {
    console.log(error)

    throw new Error(error.message || 'Cannot Delete')
  }
}
