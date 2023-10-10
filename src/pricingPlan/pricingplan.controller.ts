import { Request, Response,  NextFunction } from "express";
import PricingPlanService from "./pricingPlan.service";
import PricingPlanDAO from "./pricingPlan.dao";

class PricingPlanController{
  constructor(private readonly pricingPlanService : PricingPlanService){};

  public async addPricingPlan(req: Request, res: Response, next: NextFunction) {
    try {
      await this.pricingPlanService.addPricingPlan({ ...req.body });
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async getAllPricingPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const pricingPlans = await this.pricingPlanService.getAllPricingPlan();
      res.status(200).json({ status: "success", data: pricingPlans });
    } catch (error) {
      next(error);
    }
  }

  public async getPricingPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const pricingPlan = await this.pricingPlanService.getPricingPlan(+(req.params.pricing_plan_id));
      res.status(200).json({ status: "success", data: pricingPlan });
    } catch (error) {
      next(error);
    }
  }

  public async updatePricingPlan(req: Request, res: Response, next: NextFunction) {
    try {
      await this.pricingPlanService.updatePricingPlan({ ...req.body, id: +(req.params.pricing_plan_id)});
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }

  public async deletePricingPlan(req: Request, res: Response, next: NextFunction) {
    try {
      await this.pricingPlanService.deletePringPlan(+(req.params.pricing_plan_id));
      res.status(200).json({ status: "success", data: null });
    } catch (error) {
      next(error);
    }
  }
}

export default new PricingPlanController(new PricingPlanService(new PricingPlanDAO()));