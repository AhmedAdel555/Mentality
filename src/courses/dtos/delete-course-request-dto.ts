import Roles from "../../utils/roles.enum";

interface DeleteCourseRequestDTO {
  course_id: string
  user_id:string
  user_role:Roles
}

export default DeleteCourseRequestDTO;