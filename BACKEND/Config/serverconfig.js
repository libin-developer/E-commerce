import dotenv from "dotenv"

dotenv.config();

export default {
    mongodburl:process.env.DB_URL,
    port :process.env.PORT ||3000,
    token:process.env.TOKEN_SECRET,
    apppassword:process.env.NODEMAILER_PASSWORD,
    appemail:process.env.NODEMAILER_EMAIL,
    cloudinaryname:process.env.CLOUDINARY_CLOUD_NAME,
    clodinaryapikey:process.env.CLOUDINARY_API_KEY,
    clodinaryapisecret:process.env.CLOUDINARY_API_SECRET,
    Razorpaykeyid:process.env.RAZORPAY_KEY_ID,
    Razorpaysecret:process.env.RAZORPAY_KEY_SECRET,
    

}