import express from "express"
import { checkuser, deleteuser, forgetpassword,getUserName,Totalusers, userLogout, usersignin, usersignup } from "../Controlls/usercontrolls.js";
import authenticateUser from "../MIDDLEWARES/usermiddleware.js";



const UserRouter = express.Router();

UserRouter.post("/signup",usersignup)
UserRouter.get("/check-user",authenticateUser,checkuser)
UserRouter.post("/signin",usersignin)
UserRouter.post("/forgetpassword",forgetpassword)
UserRouter.get("/get-user",authenticateUser,getUserName)
UserRouter.delete("/delete-account/:id",authenticateUser,deleteuser)
UserRouter.get("/totalusers/",authenticateUser,Totalusers)
UserRouter.post("/logout", authenticateUser, userLogout); 


export default UserRouter;