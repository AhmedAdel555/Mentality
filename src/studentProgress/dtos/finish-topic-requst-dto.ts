import Roles from "../../utils/roles.enum";

interface FinishTopicRequestDTO{
  course_id: string
  lesson_id: string
  topic_id: string
  user_id: string
  user_role: Roles
  task_solution: string | null
}
export default FinishTopicRequestDTO;