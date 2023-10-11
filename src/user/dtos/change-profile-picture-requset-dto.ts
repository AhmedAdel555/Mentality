import Roles from "../../utils/roles.enum";

interface ChangeProfilePictureRequsetDTO {
  user_id:string
  user_role:Roles
  profile_picture: string
}

export default ChangeProfilePictureRequsetDTO;