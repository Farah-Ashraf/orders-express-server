import { conn } from "../../../../db/connection.js";

//addproduct
export const addorder = (req,res,next) => {

    const { customerId , order_items } = req.body;

    let productIds = order_items.map((item) => item.productId); //['1','2','3']
    let productIdsString = productIds.join(','); // 1,2,3

    const query = `SELECT id, unitPrice FROM product WHERE id IN (${productIdsString}) ORDER BY FIELD(id, ${productIdsString})`;

    conn.execute(query, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message , success: false });
        }

        for (let i = 0; i < order_items.length; i++) {
            if (!result[i]) {
                return res.status(404).json("product not found");
            }
            order_items[i].unitPrice = result[i].unitPrice;
        }

        const total_amount = order_items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
        const currentDate = new Date().toISOString().slice(0, 10);
        const query2 = `INSERT INTO orders (customerId, orderDate, totalAmount) VALUES ('${customerId}', '${currentDate}', '${total_amount}')`;

        conn.execute(query2, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error', details: err });
            }

            const values = order_items.map((item) => `('${result.insertId}', '${item.productId}', '${item.quantity}', '${item.unitPrice}')`).join(',');

            const query3 = `INSERT INTO orderitem (orderId, productId, quantity, unitPrice) VALUES ${values}`;

            conn.execute(query3, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error', details: err });
                }

                if (result) {
                    return res.json("order created");
                } else {
                    return res.json("order failed");
                }
            });
        });
    });
    

}

//calculate Average Order Value 
export const calculateAvgOrderValue = (req,res) => {
    
    let query = `SELECT AVG(totalAmount) AS Average_order_value FROM orders WHERE customerId = ${req.params.id} `;

    conn.execute(query, (err,result) => {
        if (err) {
            return res.status(500).json({ message: err.message , success: false });
        }
        return res.status(200).json(result);


    })

} 
//list customers with no order
export const listCustomersWithNoOrder = (req,res,next) => {

    let query = "SELECT c.id, c.firstName, c.email FROM customers c LEFT JOIN orders o ON c.id = o.customerId WHERE o.customerId IS NULL";
    conn.execute(query, (err,result) => {
        if (err) {
            return res.status(500).json({ message: err.message , success: false });
        }
        return res.status(200).json(result);


    })

}

//API to find the customer who has purchased the most items in total.
export const customersWithMostItems = (req,res,next) => {

    let query = "SELECT c.id, c.firstName, SUM(oi.quantity) AS total_items_purchased FROM customers c JOIN orders o ON c.id = o.customerId JOIN orderitem oi ON o.id = oi.orderId GROUP BY c.id, c.firstName ORDER BY total_items_purchased DESC LIMIT 1";
    conn.execute(query, (err,result) => {
        if (err) {
            return res.status(500).json({ message: err.message , success: false });
        }
        return res.status(200).json(result);
    })

}


//API to list the top 10 customers who have spent the most money.
export const topTenCustomersSpentmoney = (req,res,next) => {

    let query = `SELECT c.id, c.firstName, SUM(o.totalAmount) AS total_spent FROM customers c 
    JOIN orders o ON c.id = o.customerId 
    GROUP BY c.id, c.firstName 
    ORDER BY total_spent DESC 
    LIMIT 10`;
    conn.execute(query, (err,result) => {
        if (err) {
            return res.status(500).json({ message: err.message , success: false });
        }
        return res.status(200).json(result);
    })

}

//API to list all customers who have made at least 5 orders.
export const atLeastFiveOrders = (req,res,next) => {
    const query = `SELECT c.id, c.firstName, c.email, COUNT(o.id) as count_order
    FROM customers c
    JOIN orders o on c.id = o.customerId
    GROUP BY c.id, c.firstName, c.email
    HAVING COUNT(o.id) >= 5`

    conn.execute(query, (err,result) => {
        if (err) {
            return res.status(500).json({ message: err.message , success: false });
        }
        return res.status(200).json(result);
    })

}

//API to find the percentage of customers who have made more than one order.
export const percentageMoreThanOneOrder = (req,res,next) => {
    const query = `SELECT (COUNT(DISTINCT many_orders.customerId)/COUNT(DISTINCT all_customers.id))*100 AS Percentage
    FROM customers all_customers
    LEFT JOIN (SELECT customerId FROM orders GROUP BY customerId HAVING COUNT(id) > 1 ) AS many_orders
    ON all_customers.id = many_orders.customerId`

    conn.execute(query, (err,result) => {
        if (err) {
            return res.status(500).json({ message: err.message , success: false });
        }
        return res.status(200).json(result);
    })

}

//API to find the customer who has made the earliest order.
export const customerearliestOrder = (req,res,next) => {
    const query = `SELECT c.id, c.firstName, c.email, o.orderDate
    FROM customers c
    JOIN orders o on c.id = o.customerId
    ORDER BY  o.orderDate ASC
    LIMIT 1`;
    conn.execute(query, (err,result) => {
        if (err) {
            return res.status(500).json({ message: err.message , success: false });
        }
        result[0].orderDate = result[0].orderDate.toISOString().slice(0,10);
        return res.status(200).json(result);
    })

}