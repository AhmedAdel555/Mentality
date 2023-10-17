import AddTopicRequestDTO from "./dtos/add-topic-request-dto";
import ResponseAllTopicsInfoDTO from "./dtos/response-all-topics-info-dto";
import ResponseTopicInfoDTO from "./dtos/response-topic-info-dto";
import UpdateTopicRequestDTO from "./dtos/update-topic-request-dto";

interface ITopicServices {
  addTopic(addTopicRequestDTO: AddTopicRequestDTO): Promise<void>;
  getAllLessonTopics(lesson_id: string): Promise<ResponseAllTopicsInfoDTO[]>;
  getTopic(id: string): Promise<ResponseTopicInfoDTO>;
  updateTopic(updateTopicRequestDTO:UpdateTopicRequestDTO): Promise<void>;
  deleteTopic(id: string): Promise<void>;
}
export default ITopicServices;