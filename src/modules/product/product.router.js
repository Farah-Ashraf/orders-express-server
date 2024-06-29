import { Router } from "express";
import { addproduct, noOfItemsSold, productTotalRevenue } from "./controller/product.controller.js";
const productRouter = Router()
//addproduct
productRouter.post('/product' , addproduct)
//productTotalRevenue
productRouter.get('/productTotalRevenue' , productTotalRevenue)
//no. of product items sold
productRouter.get('/    ', noOfItemsSold)

//expport default
export default productRouter