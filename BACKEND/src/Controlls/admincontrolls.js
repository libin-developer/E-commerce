import Admin from "../DBmodels/adminmodel.js"
import bcrypt from "bcryptjs"
import { sendPasswordChangeEmail } from "../NODEMAILER/nodemailer.js";
import adminToken from "../JWT/admintoken.js";
import { Emailexist } from "../EMAILEXIST/findemailexist.js";


//check admin

export const checkadmin = async(req,res)=>{
    try {
        const admin =req.user //req.user from adminmiiddleware
        console.log(admin.data);
        const findseller = await Admin.findOne({ email: admin.data });
        if(!findseller){
          return res.json({ message: "authentication failed", success: false });
        }
           res.json({ message: "authenticateadmin", success: true });
        
    } catch (error) {
        console.log("authentication failed",error)
        return res.status(500).json({message:"adminauthenticate failed",error,success:false})
    }
}

//signup 

export const signup =async(req,res)=>{
    try {
        const {adminname,email,password,} =req.body;

        const exist =await Emailexist(email)
        if(exist){
            console.log("email already used")
            return res.status(400).json({ message: `Email already used in ${exist}`,success:false });
        }
        const saltround =10;
        const hashpassword =await bcrypt.hash(password,saltround)
    
        const newadmincreate =new Admin({
            adminname,
            email,
            hashpassword,
            role:"admin",
        
        })
        
        await newadmincreate.save();

        const token =adminToken(newadmincreate)
        res.cookie("token",token,{httpOnly:true, secure:true,sameSite:'None',})
        console.log("signup successfully")
        return res.status(200).json({message:"signup successfully",adminname:newadmincreate.adminname,email:newadmincreate.email,role:newadmincreate.role,adminId:newadmincreate._id,success:true})
    
    } catch (error) {
        console.log("admin signup failed",error)
        return res.status(500).json({message:"admin signup failed",error,success:false})
    }
}
//admin signin

export const signin =async(req,res)=>{
    try {
        const {email,password} =req.body;
        const admin =await Admin.findOne({email})
        if(!admin){
            console.log("admin not found")
            return res.status(200).json({message:"admin not found",success:false})
        }
        const comparepassword =await bcrypt.compare(password,admin.hashpassword)
        if(!comparepassword){
            console.log("password is incorrect")
            return res.status(200).json({message:"password is incorrect",success:false})
        }
        
        const token =adminToken(admin)
        res.cookie("token",token,{httpOnly:true, secure:true,sameSite:'None',})
        console.log("signin successfully")
        return res.status(200).json({message:"signin successfully",adminname:admin.adminname,email:admin.email,role:admin.role,adminId:admin._id,success:true})

    } catch (error) {
        console.log("admin signin failed",error)
        return res.status(500).send({message:"admin signin failed",error,success:false})
    }
}

//forget password

export const forgetpassword =async (req,res)=>{
            try {
                const {email,newpassword} =req.body;
        
                const admin =await Admin.findOne({email});
        
                if(!admin){
                    console.log("admin not found")
                    return res.status(200).send({message:"admin not found",success:false})
                }
                const ismatch = await bcrypt.compare(newpassword,admin.hashpassword)
                if(ismatch){
                    console.log("password is already used")
                    return res.status(200).send({message:"password is already used",success:false})
                }
                const saltround =10;
                const hashednewpassword =await bcrypt.hash(newpassword,saltround);
                admin.hashpassword =hashednewpassword;
                await admin.save();
                
                
               
                await sendPasswordChangeEmail(email,admin.adminname)
                console.log("password change successfully")
                res.status(200).send({message:"password change successfully",success:true})

             } catch (error) {
             console.log("admin forgetpassword failed",error)
             return res.status(500).send({message:"admin forgetpassword failed",error,success:false})
            }
    }

    //get admin


    export const getadmin = async (req,res)=>{
      
      try{  
        const admin =await Admin.find()
        
        res.status(200).json({message:"admins",admin})

     } catch(error){
            console.log("somthing error",error)
        }
    }

    //delete admin account

    export const deleteadmin = async (req, res) => {
        try {
            const { id } = req.params;
            const admin = await Admin.findById(id);
    
            if (!admin) {
                console.log("admin not found");
                return res.status(404).json({ message: "admin not found" });
            }
    
            const deletedadmin = await Admin.findByIdAndDelete(id);
    
            if (!deletedadmin) {
                console.log("Cannot delete admin");
                return res.status(500).json({ message: "Failed to delete admin",success:false });
            }
    
            console.log("admin account deleted successfully");
            return res.status(200).json({ success: true, message: "admin account deleted successfully" });
        } catch (error) {
            console.log("admin deletion failed", error);
            return res.status(500).json({ message: "admin deletion failed", error });
        }
    };