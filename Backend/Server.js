const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const path = require('path');
const Database = require("./Database")
const { v4: uuidv4 } = require("uuid");
const { setUser } = require('../Backend/JWT/Auth.controller')
const cookieParser = require('cookie-parser')
const { restrictToLoggedinUserOnly } = require('../Backend/JWT/middlewareauth')
//socket related code 
const http=require('http');
const WebSocket=require('ws');

//logers
const loggers = require('../Backend/loggers/loggers');


const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend/ongc/build/")));
app.use(cookieParser());


var dateOBJ = new Date()
var Month = dateOBJ.getMonth() + 1
var date = dateOBJ.getFullYear() + "-" + (Month <= 9 ? "0" + Month : Month + 1) + "-" + dateOBJ.getDate();
// console.log(date);

const dbConfig = {
    connectionLimit: 10, // Adjust based on your application's needs
    host: '103.195.185.168',
    user: 'indiscpx_BLVL',
    password: 'indiscpx_BLVL@123',
    database: 'indiscpx_BLVL'
};


console.log("connection sucessfull now going to api");
app.get('/api/getdata', async (req, res) => {
    // console.log(date)
    let date=req.query.date;
    let sql = "SELECT * FROM  `ParameterColln` WHERE date = ?";
    let data = await (new Database()).runQuery(sql, [date]);
    //check logs for dataupdate
    loggers.socketLogger.log('info','Emitting dataUpdate event to clients');
    // Emit a socket event with the updated data
    // io.emit('dataUpdate', data);
    return res.json(data)//selfcalling function
});

// temperature lines data mapping api
app.get('/api/fetchData', async (req, res) => {
    let pool;

    try {
        // Create a pool
        pool = await mysql.createPool(dbConfig);  // Use await here

        // Acquire a connection from the pool
        const connection = await pool.getConnection();

        // Columns to select
        const columns = ['TT1', 'TT2', 'TT3', 'TT4', 'TT5', 'TT6', 'TT7','DateTime'];

        // Execute the query using connection.query
        const [rows, fields] = await connection.query(`SELECT ?? FROM ONGC_IOT`, [columns]);

        // Send the results as JSON
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        try {
            if (pool) {
                // Release the pool
                pool.end();
            }
        } catch (err) {
            console.error('Error releasing pool:', err);
        }
    }
});


app.get("/api/getUnits", async (req, res) => {
    let sql = "SELECT * FROM ongc"
    let data = await (new Database()).runQuery(sql, []);
    // io.emit('dataUpdate', data);
    return res.json(data)//selfcalling function
});

// app.get("/api/getdate", async (req, res) => {
//     return res.json(date);
// })


app.post('/api/signup', async (req, res) => {
    let sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?,?,?)";
    let values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];
    let data = await (new Database()).runQuery(sql, values);
    return res.json(data)
});

app.post('/api/login', async (req, res) => {
    let sql = "SELECT * FROM login WHERE `email`=? AND `password`=?";
    let values = [
        req.body.email,
        req.body.password
    ];

    // Create a new instance of the Database class
    const database = new Database();

    // Execute the query and wait for the result
    const data = await database.runQuery(sql, values);

    // Check if any rows were returned
    if (data.length > 0) {

        // Generate a session ID (uuidv4)
        const sessionID = uuidv4();
        setUser(sessionID, values);
        res.cookie('uid', sessionID, { httpOnly: true, secure: true });
        // If data is present, consider it a successful login
        return res.json({ status: 'success', sessionID });
        // return res.json(data)
    } else {
        // If no data is present, consider it a failed login
        return res.json({ status: 'failed', message: 'Invalid credentials' });
    }
});
// app.post('/api/login',async (req, res) => {
//     let sql = "SELECT * from login where `email`=? AND `password`=?";
//     let values = [
//         req.body.email,
//         req.body.password
//     ];
//     let data=await (new Database()).runQuery(sql,values);
//     return res.json(data)
// });



// app.post('/api/postDate', async (req, res) => {
//     date = req.body.date;
//     return res.json(date)
// })


// Important Donot remove
app.get("*", (req, resp) => resp.sendFile(path.join(__dirname, '../Frontend/ongc/build/index.html')))

//Creating a server
const server=http.createServer(app);

//Websocket Creation
const wss=new WebSocket.Server({server});
wss.on("connection",(ws)=>{
    console.log("rushyaaa")
    ws.on("message",message=>{
        console.log(message.toString('utf8'));
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(message);
            } 
          });
    });
    ws.on('close', () => {
        console.log('Client disconnected');
      });
});

server.listen(9000, () => {
    console.log("Server Started On 9000");
});