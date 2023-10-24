import { Request, Response,  NextFunction } from "express";
import TopicServices from "./topics.service";
import TopicDAO from "./topics.dao";
import LessonDAO from "../lessons/lesson.dao";
import PricingPlanDAO from "../pricingPlan/pricingPlan.dao";
import CoursesRegistrationsDAO from "../coursesRegistrations/coursesRegistrations.dao";
import SubscriptionDAO from "../subscription/subscription.dao";

class TopicsController {
  constructor(private readonly topicService: TopicServices){};

  public async addTopic(req: Request, res: Response, next: NextFunction){
    try{
      await this.topicService.addTopic({...req.body, ...req.params})
      res.status(201).json({status: "success", data:null})
    }catch(error){
      next(error);
    }
  }

  public async getAllLessonTopics(req: Request, res: Response, next: NextFunction){
    try{
      const topics = await this.topicService.getAllLessonTopics(req.params.lesson_id)
      res.status(201).json({status: "success", data: topics})
    }catch(error){
      next(error);
    }
  }

  public async getTopic(req: Request, res: Response, next: NextFunction){
    try{
      const topic = await this.topicService.getTopic({...req.params, ...req.body})
      res.status(201).json({status: "success", data: topic})
    }catch(error){
      next(error);
    }
  }

  public async updateTopic(req: Request, res: Response, next: NextFunction){
    try{
      await this.topicService.updateTopic({...req.body, ...req.params})
      res.status(200).json({status: "success", data:null})
    }catch(error){
      next(error);
    }
  }

  public async deleteTopic(req: Request, res: Response, next: NextFunction){
    try{
      await this.topicService.deleteTopic({...req.body, ...req.params})
      res.status(200).json({status: "success", data:null})
    }catch(error){
      next(error);
    }
  }
}

export default new TopicsController(new TopicServices(
  new TopicDAO(),
  new LessonDAO(),
  new PricingPlanDAO(),
  new CoursesRegistrationsDAO(),
  new SubscriptionDAO()
));
