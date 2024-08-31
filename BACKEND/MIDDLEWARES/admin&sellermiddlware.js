import jwt from "jsonwebtoken"
import serverconfig from "../Config/serverconfig.js"


export const adminandseller =async (req,res,next)=>{

    const token =req.cookies.token

    jwt.verify(token,serverconfig.token,(err,result)=>{

        if(err){
            console.log("not verified")
            return res.status(401).send("not verified")
        }
        console.log("token",result)

        if(result.role !== "seller" && result.role !== "admin"){
            console.log("not authenticated by seller or admin")
            return res.status(401).send("not authenticated by seller or admin")
        }
        req.user = result;
        next();
    })
}