import { IUser } from '~/interfaces/user.interface'
import User from '../models/user.model'

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
    const newUser = await new User(data).save()
    return newUser
  } catch (error) {
    throw new Error('Cannot create User')
  }
}

export const UpdateUserService = async (id: string, data: IUser) => {
  try {
    const newUser = await User.findByIdAndUpdate(id, data)
    return newUser
  } catch (error) {
    throw new Error('Cannot Update User')
  }
}

export const deleteUserService = async (id: string) => {
  try {
    await User.findByIdAndDelete(id)
  } catch (error) {
    throw new Error('Cannot Update User')
  }
}
