import express from "express"
import { addproduct, countReviewsBySellerId, getproduct, productid, removeproduct, searchproducts, sellerproducts,totalproducts, Totalstatus, updateProduct,} from "../Controlls/productcontrolls.js";
import { upload } from "../MIDDLEWARES/uploadfilemw.js";
import { authenticateseller } from "../MIDDLEWARES/sellermiddleware.js";
import authenticateUser from "../MIDDLEWARES/usermiddleware.js"
import authenticateadmin from "../MIDDLEWARES/adminmiddleware.js";

const productRouter =express.Router();

productRouter.post("/add-product/:id",upload.single("image"),addproduct)
productRouter.get("/get-product",getproduct)
productRouter.get("/seller-product/:sellerId",sellerproducts)
productRouter.delete("/remove-product/:id",authenticateseller,removeproduct)
productRouter.put("/update-product/:id",authenticateseller,updateProduct)
productRouter.get("/:sellerId/totalproducts",authenticateseller,totalproducts)
productRouter.get("/product/:id",productid)
productRouter.get("/searchproduct",authenticateUser,searchproducts)
productRouter.get("/total-status",authenticateadmin,Totalstatus)
productRouter.get('/reviews-count/:sellerid',authenticateseller,countReviewsBySellerId)



export default productRouter;