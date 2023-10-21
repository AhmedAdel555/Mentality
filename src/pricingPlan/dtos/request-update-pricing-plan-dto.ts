import Roles from "../../utils/roles.enum"

interface RequestUpdatePricingPlanDTO {
  pricing_plan_id: number
  user_id:string
  user_role:Roles
  plan_name:string
  attributes:string
  price:number
}

export default RequestUpdatePricingPlanDTO;