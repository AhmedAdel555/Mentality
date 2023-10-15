import Roles from "../../../utils/roles.enum"

interface UpdateInstructorRequestDTO {
  user_id:string
  user_role:Roles
  user_name:string
  title :string
  description : string
  phone_number :string | null
  address : string | null
}

export default UpdateInstructorRequestDTO;