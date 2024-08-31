import express from "express"
import { checkuser, deleteuser, forgetpassword,getUserName, Totalusers, usersignin, usersignup } from "../Controlls/usercontrolls.js";
import authenticateuser from "../MIDDLEWARES/usermiddleware.js";
import authenticateadmin from "../MIDDLEWARES/adminmiddleware.js";


const UserRouter = express.Router();

UserRouter.post("/signup",usersignup)
UserRouter.get("/check-user",authenticateuser,checkuser)
UserRouter.post("/signin",usersignin)
UserRouter.post("/forgetpassword",forgetpassword)
UserRouter.get("/get-user",authenticateuser,getUserName)
UserRouter.delete("/delete-account/:id",authenticateuser,deleteuser)
UserRouter.get("/totalusers/",authenticateadmin,Totalusers)
    


export default UserRouter;