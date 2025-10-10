import { DISHES_STATUS } from '~/constants/enum'

export interface IDishes {
  dish_name: string
  description: string
  price: number
  imageUrl: string
  status: DISHES_STATUS
  category_id?: string
}
