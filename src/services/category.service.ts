import { ICategory } from '~/interfaces/category.type'
import Category from '../models/category.model'
import Product from '../models/dish.model'
export const getAllCategoryService = async (search?: string, status?: string, page: number = 1) => {
  try {
    const query: any = {}

    // tìm kiếm theo tên
    if (search) {
      query.category_name = { $regex: search, $options: 'i' }
    }

    // lọc theo status
    if (status) {
      query.status = status
    }

    // const limit = 6  cố định 6 item mỗi trang
    // const skip = (page - 1) * limit

    const [data, total] = await Promise.all([Category.find(query), Category.countDocuments(query)])
    return {
      total,
      page,
      // limit,
      // totalPages: Math.ceil(total / limit),
      data
    }
  } catch (error) {
    throw new Error('Cannot get Category')
  }
}

export const getOneCategoryService = async (id: string) => {
  try {
    const category = await Category.findById(id)
    return category
  } catch (error) {
    throw new Error(`Cannot get Category by id : ${id}`)
  }
}

export const createCategoryService = async (data: ICategory): Promise<ICategory> => {
  try {
    const newCate = await new Category(data).save()
    return newCate
  } catch (error) {
    throw new Error('Cannot create Category')
  }
}

export const updateCategoryService = async (id: string, data: ICategory) => {
  try {
    const newCate = await Category.findByIdAndUpdate(id, data)
    return newCate
  } catch (error) {
    throw new Error('Cannot Update Category')
  }
}

export const deleteCategoryService = async (id: string) => {
  try {
    const productCount = await Product.countDocuments({ category_id: id })
    if (productCount > 0) {
      throw new Error('Danh mục này vẫn còn sản phẩm, không thể xóa.')
    }

    console.log('success')

    const deleted = await Category.findByIdAndDelete(id)

    if (!deleted) {
      throw new Error('Không tìm thấy danh mục để xóa.')
    }

    return { message: 'Xóa danh mục thành công.' }
  } catch (error) {
    throw new Error('Cannot Delete')
  }
}
