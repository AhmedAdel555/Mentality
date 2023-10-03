import { Router, Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import validateResult from "../../middlewares/validateResulte";
import isAuth from "../../middlewares/isAuth";
import allowTo from "../../middlewares/allowTo";
const routes = Router();

routes.route('/')
.post([
  body("email").trim().isEmail(),
  body("userName").trim().isLength({ min: 5 }),
  body("password")
    .trim()
    .matches(
      "^(?=.*d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-#$.%&*@])(?=.*[a-zA-Z]).{8,16}$"
    )
    .withMessage(
      `password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`
    ),
  body("confirmPassword").custom((value, { req }) => {
    return value === req.body.password;
  }),
  body('title').trim().isLength({min: 8}),
  body('description').trim().isLength({min: 10})
],
validateResult,
isAuth,
allowTo('Admin'),
(req: Request, res:Response, next: NextFunction) => {
  
})
.get((req: Request, res:Response, next: NextFunction) => {
  
})

routes.route('/:instructor')
.get()
.put()
.delete()