import Roles from "../../../utils/roles.enum"

interface AddAdminRequestDTO {
    user_id:string
    user_role:Roles
    user_pricing_plan_id: string
    email: string
    user_name: string
    password: string
    confirm_password:string
}

export default AddAdminRequestDTO;