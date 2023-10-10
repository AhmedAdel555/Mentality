import Roles from "../../utils/roles.enum"

interface RequestUpdatePricingPlanDTO {
  id: number
  user_id:string
  user_role:Roles
  user_pricing_plan_id: string
  plan_name:string
  attributes:string
  price:number
}

export default RequestUpdatePricingPlanDTO;