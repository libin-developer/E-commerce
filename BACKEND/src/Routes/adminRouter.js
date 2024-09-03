import express from "express"
import { checkadmin, deleteadmin, forgetpassword, getadmin, signin, signup } from "../Controlls/admincontrolls.js";
import authenticateadmin from "../MIDDLEWARES/adminmiddleware.js";


export const adminRouter =express.Router();

adminRouter.post("/signup",signup)
adminRouter.post("/signin",signin)
adminRouter.post("/forgetpassword",forgetpassword)
adminRouter.get("/get-admin",authenticateadmin,getadmin)
adminRouter.get("/check-admin",authenticateadmin,checkadmin)
adminRouter.delete("/delete-admin/:id",authenticateadmin,deleteadmin)