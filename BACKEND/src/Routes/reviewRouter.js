import express from "express";
import { addReview, deleteReview, editReview } from "../Controlls/reviewcontrolls.js";
import authenticateUser from "../MIDDLEWARES/usermiddleware.js";

const reviewRouter = express.Router();

reviewRouter.post("/add-review/:id", authenticateUser, addReview);

// Route to edit an existing review (requires authentication and authorization by the reviewer)
reviewRouter.put("/update/:reviewerId/:reviewId", authenticateUser, editReview);

// Route to delete a review (requires authentication and authorization by the reviewer)
reviewRouter.delete("/delete/:productId/:reviewId/:userId", authenticateUser, deleteReview);

export default reviewRouter;

