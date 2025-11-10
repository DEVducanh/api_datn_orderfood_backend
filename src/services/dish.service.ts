import { IDishes } from '~/interfaces/dish.type'
import Dish from '../models/dish.model'
import { IUser } from '~/interfaces/user.type'
import mongoose from 'mongoose'

export const getAllDishService = async (search?: string, status?: string, categoryId?: string, page: number = 1) => {
  try {
    const query: any = {}
    if (search) {
      query.dish_name = { $regex: search, $options: 'i' }
    }

    // lọc theo status
    if (status) {
      query.status = status
    }

    // lọc theo category
    if (categoryId) {
      query.category_id = new mongoose.Types.ObjectId(categoryId)
    }

    const [data, total] = await Promise.all([
      Dish.find(query).populate('category_id', 'category_name'),
      Dish.countDocuments(query)
    ])

    return {
      data,
      pagination: {
        total,
        page
      }
    }
  } catch (error) {
    throw new Error('Cannot get Dishes')
  }
}

export const getOneDishService = async (id: string) => {
  try {
    const data = await Dish.findById(id)
    return data
  } catch (error) {
    throw new Error(`Cannot get Dish by id : ${id}`)
  }
}

export const createDishService = async (data: IDishes): Promise<IDishes> => {
  try {
    const newDish = await new Dish(data).save()
    return newDish
  } catch (error) {
    console.log(error)

    throw new Error('Cannot create Dish')
  }
}

export const updateDishService = async (id: string, data: IDishes) => {
  try {
    const dish = await Dish.findByIdAndUpdate(id, data)
    return dish
  } catch (error) {
    throw new Error('Cannot update Dish')
  }
}

export const deleteDishService = async (id: string) => {
  try {
    await Dish.findByIdAndDelete(id)
  } catch (error) {
    throw new Error('Cannot delete Dish')
  }
}
