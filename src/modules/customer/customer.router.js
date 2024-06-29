//import modules
import { Router } from "express";
import { signin, signup } from "./controller/customer.controller.js";
const customerRouter = Router()
//sign up
customerRouter.post('/signup' , signup)
customerRouter.post('/login' , signin)
//sign in

//expport default
export default customerRouter