import Roles from "../../utils/roles.enum";

interface DeleteCourseRequestDTO {
  id: string
  user_id:string
  user_role:Roles
  user_pricing_plan_id: string
}

export default DeleteCourseRequestDTO;