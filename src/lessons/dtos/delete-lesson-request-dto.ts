import Roles from "../../utils/roles.enum";

interface DeleteLessonRequestDTO {
  lesson_id: string
  course_id: string
  user_id:string
  user_role:Roles
}

export default DeleteLessonRequestDTO;