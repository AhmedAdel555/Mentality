import Roles from "../../utils/roles.enum";

interface DeleteCourseRequestDTO {
  id: string
  user_id:string
  user_role:Roles
}

export default DeleteCourseRequestDTO;