import jwt from "jsonwebtoken"
import serverconfig from "../Config/serverconfig.js"



export function authenticateseller(req,res,next){

    const token =req.cookies.token

    jwt.verify(token,serverconfig.token,(err,result)=>{
        console.log(err)
        if(err){
           
            return res.status(401).send("not verified")
        }
        console.log("seller token",result)

       
        req.seller =result ;
        console.log(req.seller.role)
        
        next();
        
    });
}