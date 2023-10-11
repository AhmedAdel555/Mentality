import Roles from "../../utils/roles.enum"

interface CreateSubscriptionRequestDTO{
  user_id:string
  user_role:Roles
  student_email: string
  pricing_plan_id: number
}

export default CreateSubscriptionRequestDTO;