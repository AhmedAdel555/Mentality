import Roles from "../../utils/roles.enum"

interface UpdateTopicRequestDTO {
  user_id:string
  user_role:Roles
  title: string
  description: string
  topic_order: number
  points: number
  course_id: string
  lesson_id: string
  pricing_plan_id: number
  content_url: string | null
  topic_type: string
}
export default UpdateTopicRequestDTO;