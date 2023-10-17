import Roles from "../../utils/roles.enum"

interface DeleteTopicRequestDTO{
  user_id:string
  user_role:Roles
  topic_id: string
  course_id: string
  lesson_id: string
}
export default DeleteTopicRequestDTO;