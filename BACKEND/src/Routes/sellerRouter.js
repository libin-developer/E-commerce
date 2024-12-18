import express from "express"
import { checkseller, deleteseller, forgetpassword, getseller, SellerLogout, signin, signup, Totalsellers } from "../Controlls/sellercontrolls.js";
import { adminandseller } from "../MIDDLEWARES/admin&sellermiddlware.js";
import {authenticateseller} from "../MIDDLEWARES/sellermiddleware.js"

export const sellerRouter =express.Router();

sellerRouter.post("/signup",signup)
sellerRouter.post("/signin",signin)
sellerRouter.post("/forgetpassword",forgetpassword)
sellerRouter.get("/get-seller",adminandseller,getseller)
sellerRouter.get("/check-seller",authenticateseller,checkseller)
sellerRouter.delete("/delete-seller/:id",authenticateseller,deleteseller)
sellerRouter.get("/totalsellers",adminandseller,Totalsellers)
sellerRouter.post("/logoutseller",SellerLogout)