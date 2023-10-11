import Roles from "../../utils/roles.enum"

interface RequestAddPricingPlanDTO{
  user_id:string
  user_role:Roles
  plan_name:string
  attributes:string
  price:number
}
export default RequestAddPricingPlanDTO;