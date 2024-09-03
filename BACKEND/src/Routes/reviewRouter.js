import express from "express"
import { addReview} from "../Controlls/reviewcontrolls.js";
import authenticateUser from "../MIDDLEWARES/usermiddleware.js";



const reviewRouter =express.Router()

reviewRouter.post("/add-review/:id",authenticateUser,addReview)


export default reviewRouter; 