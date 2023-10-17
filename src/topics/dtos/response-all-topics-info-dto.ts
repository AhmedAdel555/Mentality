import PricingPlanModel from "../../pricingPlan/pricingPlan.model";

interface ResponseAllTopicsInfoDTO{
  id: string
  title: string
  topic_order: number
  points: number
  pricing_plan: PricingPlanModel;
  topic_type: string
}
export default ResponseAllTopicsInfoDTO;