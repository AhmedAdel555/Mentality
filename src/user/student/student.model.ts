import CourseRegistrationModel from "../../courseRegistration/courseRegistration.model";
import PricingPlanModel from "../../pricingPlan/pricingPlan.model";
import RatesModel from "../../rates/rates.model";
import SubscriptionModel from "../../subscription/subscription.model";
import UserModel from "../user.model";

class StudentModel extends UserModel {
  public points: number
  public pricing_plane: PricingPlanModel
  public subcriptions: SubscriptionModel[];
  public coursesRegistration: CourseRegistrationModel[];
  public rates: RatesModel[];
  constructor(user_name: string, email: string, password: string, profile_picture:string, pricing_plan: PricingPlanModel){
    super(user_name, email, password, profile_picture);
    this.points = 0;
    this.pricing_plane = pricing_plan;
    this.subcriptions = [];
    this.coursesRegistration = [];
    this.rates = [];
  }
}
export default StudentModel;