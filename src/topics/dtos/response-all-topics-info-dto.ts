import PricingPlanModel from "../../pricingPlan/pricingPlan.model";
import Topics from "../topics.enum";

interface ResponseAllTopicsInfoDTO{
  id: string
  title: string
  topic_order: number
  points: number
  pricing_plan: PricingPlanModel;
  topic_type: Topics
}
export default ResponseAllTopicsInfoDTO;