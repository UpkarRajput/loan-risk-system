// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// module.exports = pool.promise();
// backend/db.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool (better for handling multiple users)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection((err, conn) => {
    if(err) {
        console.error("Database Connection Failed: ", err.message);
    } else {
        console.log("Successfully connected to Railway MySQL!");
        conn.release(); // Release the connection back to the pool
    }
});

// Export with Promises so we can use async/await in our server
module.exports = pool.promise();