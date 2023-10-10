import SubcriptionResponsDTO from "./dtos/all-subcriptions-respons-dto";
import CreateSubscriptionRequestDTO from "./dtos/create-subscription-request-dto";

interface ISubscriptionServices {
  createSubscription(createSubscriptionRequestDTO:CreateSubscriptionRequestDTO): Promise<void>;
  getAllSubscriptions(): Promise<SubcriptionResponsDTO[]>;
  getSubscription(id: string): Promise<SubcriptionResponsDTO>
  deleteSubscription(id: string): Promise<void>;
}

export default ISubscriptionServices;