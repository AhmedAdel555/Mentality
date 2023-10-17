import AddTopicRequestDTO from "./dtos/add-topic-request-dto";
import DeleteTopicRequestDTO from "./dtos/delete-topic-request-dto";
import GetTopicInfoRequestDTO from "./dtos/get-topic-info-request-dto";
import ResponseAllTopicsInfoDTO from "./dtos/response-all-topics-info-dto";
import ResponseTopicInfoDTO from "./dtos/response-topic-info-dto";
import UpdateTopicRequestDTO from "./dtos/update-topic-request-dto";

interface ITopicServices {
  addTopic(addTopicRequestDTO: AddTopicRequestDTO): Promise<void>;
  getAllLessonTopics(lesson_id: string): Promise<ResponseAllTopicsInfoDTO[]>;
  getTopic(getTopicInfoRequestDTO:GetTopicInfoRequestDTO): Promise<ResponseTopicInfoDTO>;
  updateTopic(updateTopicRequestDTO:UpdateTopicRequestDTO): Promise<void>;
  deleteTopic(deleteTopicRequestDTO: DeleteTopicRequestDTO): Promise<void>;
}
export default ITopicServices;