import Roles from "../../utils/roles.enum"

interface GradeTaskRequestDTO {
  course_id: string
  lesson_id: string
  topic_id: string
  user_id: string
  user_role: Roles
  student_id: string
  grade: number
}
export default GradeTaskRequestDTO;