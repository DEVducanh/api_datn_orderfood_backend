import { STATUS_FEEDBACK, TYPE_FEEDBACK } from '~/constants/enum'

export interface IFeedback {
  user_id?: string
  order_id?: string
  dish_id?: string
  type: TYPE_FEEDBACK
  rating: number
  content: string
  image: string
  status: STATUS_FEEDBACK
  created_at?: string
}
