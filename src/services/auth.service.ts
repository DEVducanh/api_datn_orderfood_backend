import { ILogin, IRegister } from '~/interfaces/user.type'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import { USER_ROLE } from '~/constants/enum'

export const registerService = async (data: IRegister) => {
  try {
    const { username, email, password, phone, role } = data

    const numericRole = Number(role)
    if ([USER_ROLE.WAITER, USER_ROLE.CASHIER, USER_ROLE.CHEF, USER_ROLE.ADMIN].includes(numericRole)) {
      throw new Error('Không được phép đăng ký vai trò này. Vui lòng liên hệ Admin để được tạo tài khoản.')
    }

    const exitingUser = await User.findOne({ email })
    if (exitingUser) {
      throw new Error('Email already exists')
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      phone,
      role
    })
    return newUser
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message || 'Cannot register')
  }
}

export const loginService = async (data: ILogin) => {
  try {
    const { email, password } = data
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error(`Không tìm thấy tài khoản có email ${email}`)
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('Sai mật khẩu')
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '24h' })
    return { user, token }
  } catch (error: any) {
    throw new Error(error.message || 'Cannot login')
  }
}
