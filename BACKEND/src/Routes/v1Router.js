import express from "express"
import { sellerRouter } from "./sellerRouter.js";
import productRouter from "./productRouter.js";
import reviewRouter from "./reviewRouter.js";
import UserRouter from "./userRoutes.js";
import { adminRouter } from "./adminRouter.js";
import paymentRouter from "./paymentRouter.js";
import CartRouter from "./CartRouter.js";




export const v1Router =express.Router();

v1Router.get("/",(req,res)=>{
    return res.send("helo world")
})

v1Router.use("/user",UserRouter)
v1Router.use("/seller",sellerRouter)
v1Router.use("/admin",adminRouter)
v1Router.use("/product",productRouter)
v1Router.use("/review",reviewRouter)
v1Router.use("/cart",CartRouter)
v1Router.use("/payment",paymentRouter)
