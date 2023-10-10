import Roles from "../../utils/roles.enum"

interface UpdateCoursePictureRequest {
  id: string
  user_id:string
  user_role:Roles
  user_pricing_plan_id: string
  picture: string
}

export default UpdateCoursePictureRequest;