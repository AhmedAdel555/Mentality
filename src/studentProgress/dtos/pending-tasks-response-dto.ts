import LessonResponsDTO from "../../lessons/dtos/lesson-respons-dto";
import PricingPlanModel from "../../pricingPlan/pricingPlan.model";
import Topics from "../../topics/topics.enum";
import ResponeStudentInfoDTO from "../../user/student/dtos/respone-student-info-dto";

interface PendingTasksResponseDTO {
  student: ResponeStudentInfoDTO;
  topic: {
    id: string;
    title: string;
    topic_order: number;
    points: number;
    pricing_plan: PricingPlanModel;
    topic_type: Topics;
    description: string;
    content_url: string | null;
    lesson: LessonResponsDTO;
  };
  solution: string | null;
}
export default PendingTasksResponseDTO;
