import { IUser } from '~/interfaces/user.interface'
import User from '../models/user.model'

export const createUserService = async (data: IUser): Promise<IUser> => {
  try {
    const newUser = await new User(data).save()
    return newUser
  } catch (error) {
    console.log(error)
    throw new Error('Cannot create User')
  }
}
