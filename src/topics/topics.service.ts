import AddTopicRequestDTO from "./dtos/add-topic-request-dto";
import ResponseAllTopicsInfoDTO from "./dtos/response-all-topics-info-dto";
import ResponseTopicInfoDTO from "./dtos/response-topic-info-dto";
import UpdateTopicRequestDTO from "./dtos/update-topic-request-dto";
import ITopicServices from "./topicServices.interface";
import TopicDAO from "./topics.dao";

class TopicServices implements ITopicServices {
  constructor(private readonly topicDAO: TopicDAO) {};

  addTopic(addTopicRequestDTO: AddTopicRequestDTO): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getAllLessonTopics(lesson_id: string): Promise<ResponseAllTopicsInfoDTO[]> {
    throw new Error("Method not implemented.");
  }
  getTopic(id: string): Promise<ResponseTopicInfoDTO> {
    throw new Error("Method not implemented.");
  }
  updateTopic(updateTopicRequestDTO: UpdateTopicRequestDTO): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteTopic(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
export default TopicServices;
