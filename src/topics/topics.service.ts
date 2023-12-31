import CoursesRegistrationsDAO from "../coursesRegistrations/coursesRegistrations.dao";
import LessonDAO from "../lessons/lesson.dao";
import PricingPlanDAO from "../pricingPlan/pricingPlan.dao";
import StudentProgressDAO from "../studentProgress/studentProgress.dao";
import SubscriptionDAO from "../subscription/subscription.dao";
import AppError from "../utils/appError";
import Roles from "../utils/roles.enum";
import AddTopicRequestDTO from "./dtos/add-topic-request-dto";
import DeleteTopicRequestDTO from "./dtos/delete-topic-request-dto";
import GetTopicInfoRequestDTO from "./dtos/get-topic-info-request-dto";
import ResponseAllTopicsInfoDTO from "./dtos/response-all-topics-info-dto";
import ResponseTopicInfoDTO from "./dtos/response-topic-info-dto";
import UpdateTopicRequestDTO from "./dtos/update-topic-request-dto";
import TopicModel from "./topic.model";
import ITopicServices from "./topicServices.interface";
import TopicDAO from "./topics.dao";

class TopicServices implements ITopicServices {
  constructor(
    private readonly topicDAO: TopicDAO,
    private readonly lessonDAO: LessonDAO,
    private readonly pricingPlanDAO: PricingPlanDAO,
    private readonly courseRegistrationDAO: CoursesRegistrationsDAO,
    private readonly subscriptionDAO: SubscriptionDAO,
    private readonly studentProgressDAO: StudentProgressDAO
  ) {}

  public async addTopic(addTopicRequestDTO: AddTopicRequestDTO): Promise<void> {
    try {
      const lesson = await this.lessonDAO.getlessonById(
        addTopicRequestDTO.lesson_id
      );
      if (!lesson) throw new AppError("lesson not found", 404);

      if(lesson.course.instructor.id !== addTopicRequestDTO.user_id){
        throw new AppError("you can't update this topic", 403);
      }

      const pricingPlan = await this.pricingPlanDAO.getPricingPlanById(
        addTopicRequestDTO.pricing_plan_id
      );
      if (!pricingPlan) throw new AppError("pricing plan not found", 404);

      const topicOrder = await this.topicDAO.countLessonTopics(lesson.id) + 1;

      const topic = new TopicModel(
        addTopicRequestDTO.title,
        addTopicRequestDTO.description,
        topicOrder,
        addTopicRequestDTO.points,
        lesson,
        pricingPlan,
        addTopicRequestDTO.content_url,
        addTopicRequestDTO.topic_type
      );

      const topicId = await this.topicDAO.createTopic(topic);

      await this.studentProgressDAO.addTopicToProgress(lesson.course.id, topicId);

    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getAllLessonTopics(
    lesson_id: string
  ): Promise<ResponseAllTopicsInfoDTO[]> {
    try {
      const lesson = await this.lessonDAO.getlessonById(lesson_id);
      if (!lesson) throw new AppError("lesson not found", 404);

      const topics = await this.topicDAO.getAllLessonTopics(lesson.id);

      const lessonTopicsResponse: ResponseAllTopicsInfoDTO[] = topics.map(
        (topic, index) => {
          return {
            id: topic.id,
            title: topic.title,
            topic_order: topic.topic_order,
            points: topic.points,
            pricing_plan: topic.pricing_plan,
            topic_type: topic.topic_type,
          };
        }
      );
      return lessonTopicsResponse;

    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async getTopic(
    getTopicInfoRequestDTO: GetTopicInfoRequestDTO
  ): Promise<ResponseTopicInfoDTO> {
    try {
      const topic = await this.topicDAO.getTopicById(getTopicInfoRequestDTO.topic_id);
      if(!topic) throw new AppError("topic not found", 404);
      if(getTopicInfoRequestDTO.user_role === Roles.Student){
        const studentCourses = await this.courseRegistrationDAO.getCourseRegistrationsForStudent(getTopicInfoRequestDTO.user_id);
        let registered: boolean = false;
        for(let i = 0 ; i < studentCourses.length ; i++){
          if(studentCourses[i].course.id === topic.lesson.course.id){
            registered = true;
          }
        }
        if(!registered) throw new AppError("you have to enroll in the course first", 403);
        const currentStudentPlan = (await this.subscriptionDAO.getStudentSubscriptions(getTopicInfoRequestDTO.user_id))[0].pricing_plan;
        if(topic.pricing_plan.price > currentStudentPlan.price){
          throw new AppError("upgrade to access this topic", 403);
        }
      }
      return { 
        id: topic.id, title: topic.title, topic_order: topic.topic_order, points: topic.points,
        pricing_plan: topic.pricing_plan, topic_type: topic.topic_type, 
        description: topic.description, content_url: topic.content_url
      };

    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async updateTopic(
    updateTopicRequestDTO: UpdateTopicRequestDTO
  ): Promise<void> {
    try {
      const topic = await this.topicDAO.getTopicById(
        updateTopicRequestDTO.topic_id
      );
      if (!topic) throw new AppError("topic not found", 404);

      if (updateTopicRequestDTO.user_id !== topic.lesson.course.instructor.id)
        throw new AppError("you do not have permision", 403);

      const pricingPlan = await this.pricingPlanDAO.getPricingPlanById(
        updateTopicRequestDTO.pricing_plan_id
      );
      if (!pricingPlan) throw new AppError("pricing plan not found", 404);
      
      topic.title = updateTopicRequestDTO.title;
      topic.description = updateTopicRequestDTO.description;
      topic.content_url = updateTopicRequestDTO.content_url;
      topic.points = updateTopicRequestDTO.points;
      topic.pricing_plan.id = updateTopicRequestDTO.pricing_plan_id;
      topic.topic_order = updateTopicRequestDTO.topic_order;
      topic.topic_type = updateTopicRequestDTO.topic_type;

      await this.topicDAO.updateTopic(topic);

    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }

  public async deleteTopic(deleteTopicRequestDTO: DeleteTopicRequestDTO): Promise<void> {
    try{
      const topic = await this.topicDAO.getTopicById(
        deleteTopicRequestDTO.topic_id
      );
      if (!topic) throw new AppError("topic not found", 404);

      if (deleteTopicRequestDTO.user_id !== topic.lesson.course.instructor.id)
        throw new AppError("you do not have permision", 403);

      await this.topicDAO.deleteTopicById(deleteTopicRequestDTO.topic_id);
      
    } catch (err) {
      throw new AppError(
        (err as AppError).message,
        (err as AppError).statusCode
      );
    }
  }
}
export default TopicServices;
