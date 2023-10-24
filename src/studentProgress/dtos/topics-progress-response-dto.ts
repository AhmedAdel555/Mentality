import PricingPlanModel from "../../pricingPlan/pricingPlan.model";
import Topics from "../../topics/topics.enum";
import StatusProgress from "../statusProgress.enum";

interface TopicsProgressResponseDTO {
  id: string
  title: string
  topic_order: number
  points: number
  pricing_plan: PricingPlanModel;
  topic_type: Topics,
  status: StatusProgress,
  grade: number,
  solution: string | null
}
export default TopicsProgressResponseDTO;