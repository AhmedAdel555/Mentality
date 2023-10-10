import PricingPlanModel from "../pricingPlan/pricingPlan.model";
import StudentModel from "../user/student/student.model";

class SubscriptionModel {
  public id:string;
  public student: StudentModel;
  public pricing_plan: PricingPlanModel;
  public date: Date;
  constructor(student: StudentModel, pricing_plan: PricingPlanModel){
    this.id = 'un-known';
    this.student = student;
    this.pricing_plan = pricing_plan;
    this.date = new Date();
  };
}

export default SubscriptionModel;