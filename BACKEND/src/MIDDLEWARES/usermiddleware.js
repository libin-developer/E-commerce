
import jwt from "jsonwebtoken";
import serverconfig from "../Config/serverconfig.js";


function authenticateUser(req, res, next) {
 const token = req.cookies.token;

 jwt.verify(token, serverconfig.token, (err, user) => {
   console.log(err);

   if (err) return res.sendStatus(403);

   req.user = user;
   console.log(req.user.role);

   next();
 });
}

export default authenticateUser;