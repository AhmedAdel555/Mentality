import PricingPlanDAO from "../pricingPlan/pricingPlan.dao";
import StudentDAO from "../user/student/student.dao";
import { Request, Response, NextFunction } from "express";
import SubscriptionDAO from "./subscription.dao";
import SubscriptionServices from "./subscription.service";

class SubscriptionController {
    constructor(private readonly subscriptionServices: SubscriptionServices){};

    public async addSubscription(req: Request, res: Response, next: NextFunction){
        try{
          await this.subscriptionServices.addSubscription({...req.body});
          res.status(201).json({status: "success", data: null});
        }catch (error) {
          next(error);
        }
    }

    public async getAllSubscriptions(req: Request, res: Response, next: NextFunction){
      try{
        const subscriptions = await this.subscriptionServices.getAllSubscriptions();
        res.status(201).json({status: "success", data: subscriptions});
      }catch (error) {
        next(error);
      }
    }

    public async getSubscription(req: Request, res: Response, next: NextFunction){
      try{
        const subscription = await this.subscriptionServices.getSubscription(req.params.subscription_id);
        res.status(201).json({status: "success", data: subscription});
      }catch (error) {
        next(error);
      }
    }

    public async deleteSubscription(req: Request, res: Response, next: NextFunction){
      try{
        await this.subscriptionServices.deleteSubscription(req.params.subscription_id);
        res.status(201).json({status: "success", data: null});
      }catch (error) {
        next(error);
      }
    }

}
export default new SubscriptionController(new SubscriptionServices(new SubscriptionDAO(), new StudentDAO(), new PricingPlanDAO()));