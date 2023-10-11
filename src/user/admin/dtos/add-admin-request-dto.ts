import Roles from "../../../utils/roles.enum"

interface AddAdminRequestDTO {
    user_id:string
    user_role:Roles
    email: string
    user_name: string
    password: string
    confirm_password:string
}

export default AddAdminRequestDTO;