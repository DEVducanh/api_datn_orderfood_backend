import { USER_ROLE } from '~/constants/user'

export interface IUser {
  username: string
  email: string
  phone: string
  password: string
  role: USER_ROLE // dùng enum
  createdAt: Date
  updatedAt: Date
}
