//import modules
import express from 'express'
import { connectDB } from './db/connection.js';
import customerRouter from './src/modules/customer/customer.router.js';
import orderRouter from './src/modules/order/order.router.js';
import productRouter from './src/modules/product/product.router.js';

//create server
const app = express()
const port =3000;

//connect to db
connectDB()
app.use(express.json())
app.use(customerRouter)
app.use(productRouter)
app.use(orderRouter)

//listen on the server
app.listen(port , () => console.log("Server is running"));