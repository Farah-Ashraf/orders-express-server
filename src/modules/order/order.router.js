import { Router } from "express";
import { addorder, atLeastFiveOrders, calculateAvgOrderValue, customerearliestOrder, customersWithMostItems, listCustomersWithNoOrder, percentageMoreThanOneOrder, topTenCustomersSpentmoney } from "./controller/order.controller.js";
const orderRouter = Router()

orderRouter.post('/order' , addorder)
orderRouter.get('/avgOrderValue/:id' , calculateAvgOrderValue)
orderRouter.get('/customersWithNoOrder', listCustomersWithNoOrder)
orderRouter.get('/customerMostItems' , customersWithMostItems)
orderRouter.get('/topCustomersSpentMoney' , topTenCustomersSpentmoney)
orderRouter.get('/atleastFiveOrders' , atLeastFiveOrders)
orderRouter.get('/percentage' , percentageMoreThanOneOrder)
orderRouter.get('/earliestOrder' , customerearliestOrder)






//expport default
export default orderRouter