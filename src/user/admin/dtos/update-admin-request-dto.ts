import Roles from "../../../utils/roles.enum"

interface UpdateAdminRequestDTO{
  user_id:string
  user_role:Roles
  user_name: string
  phone_number:string | null
  address:string | null
}
export default UpdateAdminRequestDTO;