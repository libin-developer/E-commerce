import Seller from "../DBmodels/sellermodel.js"
import bcrypt from "bcryptjs"
import generateToken from "../JWT/generatetoken.js";
import { sendPasswordChangeEmail } from "../NODEMAILER/nodemailer.js";
import { Emailexist } from "../EMAILEXIST/findemailexist.js";





//check seller

export const checkseller = async(req,res)=>{
    try {
        const seller =req.seller //req.user from usermiiddleware
        console.log(seller.data);
        const findseller = await Seller.findOne({ email: seller.data });
        if(!findseller){
          return res.json({ message: "authentication failed", success: false });
        }
           res.json({ message: "authenticateseller", success: true });
        
    } catch (error) {
        console.log(error)
    }

}

// seller signup

export const signup =async(req,res)=>{
    try {
        const {sellername,email,password} =req.body;
        
        const isname =await Seller.findOne({sellername})
        if(isname){
            console.log("seller name not available")
            return res.status(200).json({message:"seller name not available",success:false})
        } 
        const exist =await Emailexist(email)
        if(exist){
            console.log("email already used")
            return res.status(400).json({ message: `Email already used in ${exist}`,success:false});
        }
        const saltround =10;
        const hashpassword =await bcrypt.hash(password,saltround)

        const createseller =new Seller({
            sellername,
            email,
            hashpassword,
            role:"seller",
        })
        await createseller.save();

        
        const Token =generateToken(email)
        res.cookie("token",Token,{httpOnly:true, secure:true,sameSite:'None',})
        console.log("signup successfully")
        return res.status(200).json({message:"signup successfully",sellername:createseller.sellername,email:createseller.email,sellerId:createseller._id,success:true,})
    } catch (error) {
        console.log("signup failed",error)
        return res.status(500).json({message:"signup failed",error,success:false})
    }
}

//seller signin

 export const signin =async(req,res)=>{
    try {
        const {email,password} =req.body;

        const seller =await Seller.findOne({email})
        if(!seller){
            console.log("seller not found")
            return res.status(200).json({message:"seller not found",success:false})
        }
        const matchpassword =await bcrypt.compare(password,seller.hashpassword)
        if(!matchpassword){
            console.log("password is incorrect")
            return res.status(200).json({message:"password is incorrect",success:false})
        }
        
        const Token =generateToken(email)
        res.cookie("token",Token,{httpOnly:true, secure:true,sameSite:'None',})
        console.log("sigin successfully")
        return res.status(200).json({message:"sigin successfully",sellername:seller.sellername,email:seller.email,sellerId:seller._id,success:true})
    } catch (error) {
        console.log("signin failed",error)
        return res.status(500).json({message:"signin failed",error,success:false})
    }
}

//seller forget password

export const forgetpassword =async(req,res)=>{
    try {
        const {email,newpassword} =req.body;

        const seller =await Seller.findOne({email})
        if(!seller){
            console.log("seller not found")
            return res.status(200).send({message:"seller not found",success:false})
        }
        const comparepassword = await bcrypt.compare(newpassword,seller.hashpassword)
        if(comparepassword){
            console.log("password is already used")
            return res.status(200).send({message:"password is already used",success:false})
        }
        const saltround =10;
        const hashednewpassword =await bcrypt.hash(newpassword,saltround)
        seller.hashpassword =hashednewpassword;
        await seller.save();

        
        const Token =generateToken(email)
        res.cookie("token",Token,{httpOnly:true, secure:true,sameSite:'None',})
        await sendPasswordChangeEmail(email, seller.sellername)
        console.log("password change successfully")
        res.status(200).send({message:"password change successfully",success:true})
    } catch (error) {
        console.log("seller deletion failed error",error);
        return res.status(500).send({message:"seller deletion failed error",error,success:false});
    }
}

// get sellers

export const getseller =async(req,res)=>{

    try {
        const getsellers = await Seller.find();
        res.status(200).send(getsellers);
    } catch (error) {
      console.log("seller get failed",error)
      res.status(500).json({ message: 'seller get failed', error });
    }
}

//delete seller account

export const deleteseller = async (req, res) => {
    try {
        const { id } = req.params;
        const seller = await Seller.findById(id);

        if (!seller) {
            console.log("Seller not found");
            return res.status(404).json({ message: "Seller not found" });
        }

        const deletedSeller = await Seller.findByIdAndDelete(id);

        if (!deletedSeller) {
            console.log("Cannot delete seller");
            return res.status(500).json({ message: "Failed to delete seller" });
        }

        console.log("Seller account deleted successfully");
        return res.status(200).json({ success: true, message: "Seller account deleted successfully" });
    } catch (error) {
        console.log("User deletion failed", error);
        return res.status(500).json({ message: "User deletion failed", error });
    }
};


  /// Total sellers

  export const Totalsellers = async (req,res)=>{
    
    try {

        const totallsellers = await Seller.countDocuments({})
        res.status(200).send({mesage:"total sellers",totallsellers})

    } catch (error) {
        console.log("somtheing error counting total sellers",error)
        return res.status(500).send("somtheing error counting total sellers",error)
    }
   
  }
  // Logout User by invalidating the token
export const SellerLogout = async (req, res) => {
  try {
    // Clear the JWT token from cookies and handle token expiration
     res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
    res.clearCookie("admintoken", { httpOnly: true, secure: true, sameSite: "None" });

    console.log("seller logged out successfully");
    return res.status(200).send({ message: "seller logged out successfully", success: true });
  } catch (error) {
    console.log("Logout failed", error);
    return res.status(500).send({ message: "Logout failed", error, success: false });
  }
};