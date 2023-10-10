import PricingPlanDAO from "../pricingPlan/pricingPlan.dao";
import StudentDAO from "../user/student/student.dao";
import SubcriptionResponsDTO from "./dtos/all-subcriptions-respons-dto";
import CreateSubscriptionRequestDTO from "./dtos/create-subscription-request-dto";
import SubscriptionDAO from "./subscription.dao";
import SubscriptionModel from "./subscription.model";
import ISubscriptionServices from "./subscriptionServices.interface";

class SubscriptionServices implements ISubscriptionServices{

  constructor(private readonly subscriptionDAO: SubscriptionDAO, 
    private readonly studentDAO: StudentDAO,
    private readonly planPricingDAO:  PricingPlanDAO
    ){};

  public async createSubscription(createSubscriptionRequestDTO: CreateSubscriptionRequestDTO): Promise<void> {
     try{
      const student = await this.studentDAO.getStudent(createSubscriptionRequestDTO.studentId);
     if(!student) throw new Error("student not found");
     const pricingPlan = await this.planPricingDAO.getPricingPlan(createSubscriptionRequestDTO.pricinPlanId);
     if(!pricingPlan) throw new Error("pricing plan not found");
     const subscription = new SubscriptionModel(student, pricingPlan);
     const newSubscription = this.subscriptionDAO.createSubscription(subscription);
     if(!newSubscription) throw new Error("failed to make subscription");
     }catch(err){
      throw new Error((err as Error).message);
    }
  }
  public async getAllSubscriptions(): Promise<SubcriptionResponsDTO[]> {
     try{
      const subscriptionsFromDB = await this.subscriptionDAO.getAllSubscriptions();
     const subcriptions:SubcriptionResponsDTO[]  = subscriptionsFromDB.map((subscription, index) => {
         return {
            id: subscription.id,
            student: {
              id: subscription.student.id,
              user_name: subscription.student.user_name,
              email: subscription.student.email,
              profile_picture: subscription.student.profile_picture,
              phone_number: subscription.student.phone_number,
              address: subscription.student.address,
              points: subscription.student.points,
           },
           pricing_plan: subscription.pricing_plan,
           date: subscription.date
         }
     })
     return subcriptions;
     }catch(err){
      throw new Error((err as Error).message);
    }
  }
  public async getSubscription(id: string): Promise<SubcriptionResponsDTO> {
    try{
      const subscription = await this.subscriptionDAO.getSubscription(id);
      if(!subscription) throw new Error("failed to find subcription");
      return {
        id: subscription.id,
        student: {
          id: subscription.student.id,
          user_name: subscription.student.user_name,
          email: subscription.student.email,
          profile_picture: subscription.student.profile_picture,
          phone_number: subscription.student.phone_number,
          address: subscription.student.address,
          points: subscription.student.points,
       },
       pricing_plan: subscription.pricing_plan,
       date: subscription.date
     }
    }catch(err){
      throw new Error((err as Error).message);
    }
  }

  public async deleteSubscription(id: string): Promise<void> {
    try{
      const deletedSubscription = await this.subscriptionDAO.deleteSubscription(id);
      if(!deletedSubscription) throw new Error("failed to delete subscription");
    }catch(err){
      throw new Error((err as Error).message);
    }
  }

}

export default SubscriptionServices;