import jwt from "jsonwebtoken";
import serverconfig from "../Config/serverconfig.js";


const authenticateadmin = (req,res,next)=>{
    const token =req.cookies.token;

    jwt.verify(token,serverconfig.token,(err,result) =>{
        if(err){
            console.log(err);
            return res.status(401).send("not verified");
        }

        console.log("admin token result",result)

        if(result.role !== "admin"){
            return res.status(401).send("not admin")
        }

        req.user =result;

        next();
    })
}
 export default authenticateadmin