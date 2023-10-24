import SubcriptionResponsDTO from "./dtos/subcription-respons-dto";
import CreateSubscriptionRequestDTO from "./dtos/create-subscription-request-dto";
import StudentSubcriptionsResponsDTO from "./dtos/student-subscriptions-response-dto";

interface ISubscriptionServices {
  addSubscription(createSubscriptionRequestDTO:CreateSubscriptionRequestDTO): Promise<void>;
  getAllSubscriptions(): Promise<SubcriptionResponsDTO[]>;
  deleteSubscription(id: string): Promise<void>;
  getStudentSubscriptions(studentId: string): Promise<StudentSubcriptionsResponsDTO[]>;
}

export default ISubscriptionServices;