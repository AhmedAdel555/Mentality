import ResponseAllTopicsInfoDTO from "./response-all-topics-info-dto";

interface ResponseTopicInfoDTO extends ResponseAllTopicsInfoDTO {
  description: string
  content_url: string | null
}
export default ResponseTopicInfoDTO;