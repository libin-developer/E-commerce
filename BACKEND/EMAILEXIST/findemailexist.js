import User from "../DBmodels/usermodel.js"
import Seller from "../DBmodels/sellermodel.js"
import Admin from "../DBmodels/adminmodel.js";


export const Emailexist =async (email)=>{

    const user =await User.findOne({email})
    if(user){
        return "User";
    }

    const seller =await Seller.findOne({email})
    if(seller){
        return "Seller";
    }

    const admin =await Admin.findOne({email})
    if(admin){
        return "Admin";
    }
}