import Roles from "../../../utils/roles.enum"

interface UpdateStudentInfoDTO {
  user_name:string
  email:string
  phone_number:string | null
  address:string | null
  user_id:string
  user_role:Roles
}

export default UpdateStudentInfoDTO;