import Roles from "../../utils/roles.enum"

interface UpdateCoursePictureRequest {
  id: string
  user_id:string
  user_role:Roles
  picture: string
}

export default UpdateCoursePictureRequest;