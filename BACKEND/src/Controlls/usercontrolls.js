import bcrypt from "bcrypt"
import generateToken from "../JWT/generatetoken.js"
import { sendPasswordChangeEmail } from "../NODEMAILER/nodemailer.js"
import { Emailexist } from "../EMAILEXIST/findemailexist.js"
import User from "../DBmodels/usermodel.js"



//Check-user

export const checkuser =async(req,res)=>{
  try {
    const user =req.user //req.user from usermiiddleware
    console.log("data", user);
    const findUser = await User.findOne({ email: user.data });
    if(!findUser){
      return res.json({ message: "authentication failed", success: false });
    }
       res.json({ message: "authenticateUser", success: true });
    
  } catch (error) {
    console.log(error)
  }
}

 /*user signup */

export const usersignup = async(req,res)=>{
    try {
        const {username,email,password} = req.body

        const exist =await Emailexist(email)
        if(exist){
            console.log("email already used")
            return res.status(400).json({ message: `Email already used in ${exist}`,success:false });
        }

        const isname =await User.findOne({username})

        if(isname){
            console.log("user name not available")
            return res.status(401).send({message:"user name not available",success:false})
        }
        const saltround =10;
        const hashpassword =await bcrypt.hash(password,saltround)
        const newUser = new User(
            {
            username,    
            email,
            hashpassword,
            role:"user",
        })

        const newUsercreated = await newUser.save();

        if(!newUsercreated){
            console.log("user canot be saved")
            return res.status(401).send({message:"user cannot be saved",success:false})
            
        }
        const token = generateToken(email);
    
        res.cookie("token", token)
        console.log("signup successfully")
        return res.status(200).send({message:"signup successfully",username:newUsercreated.username,email:newUsercreated.email,_id:newUsercreated._id,success:true})
        
    } catch (error) {
        console.log("user signup error",error)
        return res.status(500).send({message:"signup failed",error,success:false})
    
    }
    
}

/*signin */

export const usersignin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.send({message:"User not found",success:false});
      }
  
      const matchPassword = await bcrypt.compare(password, user.hashpassword);
  
      if (!matchPassword) {
        console.log("password is incorrect")
        return res.send({message:"Password is incorrect",success:false});
      }
  
      const token = generateToken(email);
      res.cookie("token",token);
      console.log("login successfully")
      res.status(200).send({message:"Logged in!",username:user.username,email:user.email, _id: user._id,success:true});
     
    } catch (error) {
      console.log(error, "login failed");
      res.status(500).send({message:"login failed",error,success:false});
    }
  };
 
  //forget password

    export const forgetpassword =async (req,res)=>{
    try {
        const {email,newpassword} =req.body;

        const user =await User.findOne({email});

        if(!user){
            console.log("user not found")
            return res.send({message:"user not found",success:false})
        }
        const ismatch = await bcrypt.compare(newpassword,user.hashpassword)
        if(ismatch){
            console.log("password is already used")
            return res.send({message:"password is already used",success:false})
        }
        const saltround =10;
        const hashednewpassword =await bcrypt.hash(newpassword,saltround);
        user.hashpassword =hashednewpassword;
        await user.save();

        const Token =generateToken(email);
        res.cookie("token",Token)
        await sendPasswordChangeEmail(email, user.username);
        console.log("password change successfully")
        return res.status(200).send({message:"password change successfully",success:true})
      
    } catch (error) {
        console.log("password change error", error)
        return res.status(500).send({mesage:"password change failed", error,success:false})
    }
  }

  //get user 

  export const getUserName = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).send(user);
  } catch (error) {
    console.log("user get failed",error)
    res.status(500).json({ message: 'user get failed', error });
  }
};


  //delete user account

  export const deleteuser = async(req,res)=>{
    try {
      const id =req.params.id
      const deleteusers = await User.deleteOne({_id:id})
      if(!deleteusers){
        console.log("can not be delete")
        return res.status(401).send({message:"can not be delete",success:false})
      }
      console.log("user account deleted successfully")
      return res.status(200).send({message:"user account deleted successfully",success:true})
    } catch (error) {
      console.log("user deletion failed error",error);
      return res.status(500).send({message:"user deletion failed error",error,success:false});
    }
  }

  /// Total users

  export const Totalusers = async (req,res)=>{
    try {
      const totalusers = await User.countDocuments({})
      res.status(200).json({message:"total users",totalusers})
    } catch (error) {
      console.log("somthing error in counting users",error);
      return res.status(500).send({message:"somthing error in counting users",error});
    
    }
   
  }
  
  
 