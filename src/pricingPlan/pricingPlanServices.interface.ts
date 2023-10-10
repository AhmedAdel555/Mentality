import RequestAddPricingPlanDTO from "./dtos/request-add-pricing-plan-dto";
import RequestUpdatePricingPlanDTO from "./dtos/request-update-pricing-plan-dto";
import PricingPlanModel from "./pricingPlan.model";

interface IPricingPlanServicesInterface {
  addPricingPlan(requestAddPricingPlanDTO: RequestAddPricingPlanDTO): Promise<void>;
  updatePricingPlan(requestUpdatePricingPlanDTO: RequestUpdatePricingPlanDTO): Promise<void>;
  getAllPricingPlan(): Promise<PricingPlanModel[]>;
  getPricingPlan(id:number): Promise<PricingPlanModel>;
  deletePringPlan(id:number): Promise<void>;
}
export default IPricingPlanServicesInterface;