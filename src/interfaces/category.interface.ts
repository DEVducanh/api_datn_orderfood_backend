import { CATEGORY_STATUS } from '~/constants/enum'

export interface ICategory {
  category_name: string
  description: string
  imageUrl: string
  status: CATEGORY_STATUS
}
