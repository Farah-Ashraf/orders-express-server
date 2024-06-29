//import modules
import mysql from 'mysql2'
//create connection 
const conn = mysql.createConnection({
 host:'biqdprw2w6zrbwwhq2cy-mysql.services.clever-cloud.com',
 user:'usmvhaourphfofzl',
 password:'2a82mhub6kRCUbdr6RdN',
 database:'biqdprw2w6zrbwwhq2cy',
 port: 3306

})
// check connection
const connectDB = () => {

    return conn.connect((err) => {
        if(err)
            return console.log('fail to connect to db', err.message);
        console.log("Database connected successfully");    
    })

}
//export
export {
  conn,connectDB
}


