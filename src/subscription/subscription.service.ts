import PricingPlanDAO from "../pricingPlan/pricingPlan.dao";
import StudentDAO from "../user/student/student.dao";
import AppError from "../utils/appError";
import CreateSubscriptionRequestDTO from "./dtos/create-subscription-request-dto";
import StudentSubcriptionsResponsDTO from "./dtos/student-subscriptions-response-dto";
import SubcriptionResponsDTO from "./dtos/subcription-respons-dto";
import SubscriptionDAO from "./subscription.dao";
import SubscriptionModel from "./subscription.model";
import ISubscriptionServices from "./subscriptionServices.interface";

class SubscriptionServices implements ISubscriptionServices{

  constructor(private readonly subscriptionDAO: SubscriptionDAO, 
    private readonly studentDAO: StudentDAO,
    private readonly planPricingDAO:  PricingPlanDAO
    ){};

  public async addSubscription(createSubscriptionRequestDTO: CreateSubscriptionRequestDTO): Promise<void> {
     try{
     const student = await this.studentDAO.getStudentByEmail(createSubscriptionRequestDTO.student_email);
     if(!student) throw new AppError("student not found", 404);

     const pricingPlan = await this.planPricingDAO.getPricingPlanById(createSubscriptionRequestDTO.pricing_plan_id);
     if(!pricingPlan) throw new AppError("pricing plan not found", 404);

     const subscription = new SubscriptionModel(student, pricingPlan);

     await this.subscriptionDAO.createSubscription(subscription);
     
     }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getAllSubscriptions(): Promise<SubcriptionResponsDTO[]> {
    try{
      const subscriptionsFromDB = await this.subscriptionDAO.getAllSubscriptions();
      const subscriptions = subscriptionsFromDB.map((subscription, index) => {
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
      return subscriptions;
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }

  }

  public async deleteSubscription(id: string): Promise<void> {
    try{
      const subscription = await this.subscriptionDAO.getSubscriptionById(id);
      if(!subscription) throw new AppError("failed to find subcription", 404);

      await this.subscriptionDAO.deleteSubscriptionById(id);
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getStudentSubscriptions(studentId: string): Promise<StudentSubcriptionsResponsDTO[]>{
    try{
      const subscriptionsFromDB = await this.subscriptionDAO.getStudentSubscriptions(studentId);
      const subscriptions = subscriptionsFromDB.map((subscription, index) => {
        return {
         id: subscription.id,
         pricing_plan: subscription.pricing_plan,
         date: subscription.date
       }
      })
      return subscriptions;
    }catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
}

export default SubscriptionServices;