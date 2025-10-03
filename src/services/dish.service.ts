import { IDishes } from '~/interfaces/dish.interface'
import Dish from '../models/dish.model'

export const getAllDishService = async (
  search?: string,
  status?: string,
  categoryId?: string,
  page: number = 1,
  limit: number = 10
) => {
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
      query.category_id = categoryId
    }
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      Dish.find(query).populate('category_id', 'category_name').skip(skip).limit(limit),
      Dish.countDocuments(query)
    ])

    return {
      data,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
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

export const createDishService = async (data: IDishes) => {
  try {
    const newDish = await new Dish(data).save()
    return newDish
  } catch (error) {
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
