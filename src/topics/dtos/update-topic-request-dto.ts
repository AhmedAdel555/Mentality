import Roles from "../../utils/roles.enum"
import Topics from "../topics.enum"

interface UpdateTopicRequestDTO {
  user_id:string
  user_role:Roles
  title: string
  description: string
  topic_order: number
  points: number
  topic_id: string
  course_id: string
  lesson_id: string
  pricing_plan_id: number
  content_url: string | null
  topic_type: Topics
}
export default UpdateTopicRequestDTO;