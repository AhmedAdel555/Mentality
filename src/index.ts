import express, {Application,Request, Response, NextFunction} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import config from "./utils/envConfig";
import IError from "./error/error.interface";
import routes from "./routes";
// create my server
const app: Application = express();
/*
  Add Middlewares
*/
// cors for apis requsets
app.use(cors());
// json middleware
app.use(express.json());
// security middleware
app.use(helmet());
// rate-limit middleware
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests , please try again later"
})); // Apply the rate limiting middleware to all requests
// logging middleware
app.use(morgan("combined"));

app.use('/api', routes);

// handling non exist endpoints
app.all('*',(_req: Request,  res:Response) => {
  res.status(404).json({ status: "error", message: "Sorry this api not found 😂"});
});
// handling error
app.use((error:IError, _req: Request,  res:Response, _next: NextFunction) => {
  res.status(error.statusCode || 500).json({ status: "error" , messgae: "Error in server" + error.message});
})

// start server
app.listen(config.PORT ?? 3000);

export default app;