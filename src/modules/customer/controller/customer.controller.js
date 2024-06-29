import { conn } from "../../../../db/connection.js";
import bcrypt from 'bcrypt';

//signup
export const signup = (req,res,next) => {

    const {fisrtName,lastName,email,phone,password} = req.body;

    //check existence
    conn.execute(`select firstName ,email from customers where email =?` , [email] , (err,result) => {
        if(err){
            return res.status(401).json({message:err.message, success:false});
        }
        if(result.length){
            return res.status(409).json({message: "user already exist", success: false});
        }
        //hash password
        const hashpassword = bcrypt.hashSync(password,10);
        //add to db
        conn.execute('insert into customers (firstName,lastName,email,phone,password) values (?,?,?,?,?)',[fisrtName,lastName,email,phone,hashpassword], (err,result) => {
            if(err){
                return res.status(401).json({message:err.message, success:false});
            }
            //send response
            return res.status(201).json({message: "customer added successfully" , success: true});
        });




     
    });

}


//signup
export const signin = (req,res,next) => {

    //get data from request
    const {email,password} = req.body;

    //check existence
    let query = "select firstName,password from customers where email =?"
    conn.execute( query , [email] , (err,result) => {
        if(err){
            return res.status(401).json({message:err.message, success:false});
        }
        if(result.length == 0){
            return res.status(404).json({message: "invalid credentials", success: false});
        }

        //compare password
        if(bcrypt.compareSync(password, result[0].password) == false){
            return res.status(404).json({message: "invalid credentials", success: false});
        }

        return  res.status(200).json({message: `Welcome ${result[0].firstName}` , success: true});     
    });

}