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
// UserRouter.get('/user-role', (req, res) => {
//     const { admintoken, token } = req.cookies;

//     if (admintoken) {
//         return res.json({ role: 'admin' });
//     } else if (token) {
//         return res.json({ role: 'user' });
//     } else {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
// });



export default UserRouter;