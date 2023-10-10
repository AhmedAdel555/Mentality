import Roles from "../../../utils/roles.enum"

interface UpdateAdminRequestDTO{
  user_id:string
  user_role:Roles
  user_pricing_plan_id: string
  email: string
  user_name: string
  password: string
  confirm_password:string
  phone_number:string | null
  address:string | null
}
export default UpdateAdminRequestDTO;