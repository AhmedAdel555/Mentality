import Roles from "../../utils/roles.enum";

interface ChangeProfilePictureRequsetDTO {
  user_id:string
  user_role:Roles
  user_pricing_plan_id: string
  profile_picture: string
}

export default ChangeProfilePictureRequsetDTO;