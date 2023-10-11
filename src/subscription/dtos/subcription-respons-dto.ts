import PricingPlanModel from "../../pricingPlan/pricingPlan.model";
import ResponeStudentInfoDTO from "../../user/student/dtos/respone-student-info-dto";

interface SubcriptionResponsDTO {
  id:string;
  student: ResponeStudentInfoDTO;
  pricing_plan: PricingPlanModel;
  date: Date;
}
export default SubcriptionResponsDTO;