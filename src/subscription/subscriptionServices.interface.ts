import SubcriptionResponsDTO from "./dtos/subcription-respons-dto";
import CreateSubscriptionRequestDTO from "./dtos/create-subscription-request-dto";

interface ISubscriptionServices {
  addSubscription(createSubscriptionRequestDTO:CreateSubscriptionRequestDTO): Promise<void>;
  getAllSubscriptions(): Promise<SubcriptionResponsDTO[]>;
  getSubscription(id: string): Promise<SubcriptionResponsDTO>
  deleteSubscription(id: string): Promise<void>;
}

export default ISubscriptionServices;