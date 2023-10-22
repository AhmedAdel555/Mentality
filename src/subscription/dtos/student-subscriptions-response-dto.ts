import PricingPlanModel from "../../pricingPlan/pricingPlan.model";

interface StudentSubcriptionsResponsDTO {
  id:string;
  pricing_plan: PricingPlanModel;
  date: Date;
}
export default StudentSubcriptionsResponsDTO;