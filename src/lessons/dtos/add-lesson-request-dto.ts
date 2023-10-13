import Roles from "../../utils/roles.enum";

interface AddLessonRequestDTO {
  user_id:string
  user_role:Roles
  title: string
  course_id: string
}
export default AddLessonRequestDTO;