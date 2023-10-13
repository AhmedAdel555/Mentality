import Roles from "../../utils/roles.enum";

interface UpdateLessonRequestDTO {
  id: string
  user_id:string
  user_role:Roles
  title: string
  lesson_order:number
  course_id: string
}
export default UpdateLessonRequestDTO;