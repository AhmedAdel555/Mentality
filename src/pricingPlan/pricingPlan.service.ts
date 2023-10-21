import AppError from "../utils/appError";
import RequestAddPricingPlanDTO from "./dtos/request-add-pricing-plan-dto";
import RequestUpdatePricingPlanDTO from "./dtos/request-update-pricing-plan-dto";
import PricingPlanDAO from "./pricingPlan.dao";
import PricingPlanModel from "./pricingPlan.model";
import IPricingPlanServicesInterface from "./pricingPlanServices.interface";

class PricingPlanService implements IPricingPlanServicesInterface {
  constructor(private readonly pricingPlanDAO: PricingPlanDAO) {}

  public async addPricingPlan(
    requestAddPricingPlanDTO: RequestAddPricingPlanDTO
  ): Promise<void> {
    try {
      const newPricgingPlan = new PricingPlanModel(
        requestAddPricingPlanDTO.plan_name,
        +(requestAddPricingPlanDTO.price.toFixed(2)),
        requestAddPricingPlanDTO.attributes
      );
      await this.pricingPlanDAO.createPricingPlan(
        newPricgingPlan
      );
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async updatePricingPlan(
    requestUpdatePricingPlanDTO: RequestUpdatePricingPlanDTO
  ): Promise<void> {
    try {
      const pricingPlanFromDB = await this.pricingPlanDAO.getPricingPlanById(requestUpdatePricingPlanDTO.pricing_plan_id);
      if (!pricingPlanFromDB) throw new AppError("pricing plan not found", 404);
      pricingPlanFromDB.plan_name = requestUpdatePricingPlanDTO.plan_name;
      pricingPlanFromDB.price = +(requestUpdatePricingPlanDTO.price.toFixed(2));
      pricingPlanFromDB.attributes = requestUpdatePricingPlanDTO.attributes;
      await this.pricingPlanDAO.updatePricingPlan(pricingPlanFromDB);
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }


  public async getAllPricingPlan(): Promise<PricingPlanModel[]> {
    try {
      const pricingPlans = await this.pricingPlanDAO.getAllPricingPlans();
      return pricingPlans;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  public async getPricingPlan(id: number): Promise<PricingPlanModel> {
    try {
      const pricingPlan = await this.pricingPlanDAO.getPricingPlanById(id);
      if (!pricingPlan) throw new AppError("oops no pricing plan found", 404);
      return pricingPlan;
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
  public async deletePringPlan(id: number): Promise<void> {
    try {
      const pricingPlan = await this.pricingPlanDAO.getPricingPlanById(id);
      if (!pricingPlan) throw new AppError("oops no pricing plan found", 500);
      await this.pricingPlanDAO.deletePricingPlanById(id);
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
}

export default PricingPlanService;
