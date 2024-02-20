// const mysql = require("mysql2/promise"); // Import the promise-based version
// const loggers = require('../Backend/loggers/loggers');
// const { Console } = require("winston/lib/winston/transports");

// class Database {
//     constructor() { }

//     async runQuery(query = "", parameters = []) {
//         let databaseConnection = await mysql.createConnection({
//             host: '103.195.185.168',
//             user: 'indiscpx_BLVL',
//             password: "indiscpx_BLVL@123",
//             database: 'indiscpx_BLVL'
//         });

//         loggers.dataLogger.log('info', `Connection created`);

//         try {
//             const [rows, fields] = await databaseConnection.execute(query, parameters);
//             loggers.dataLogger.log('info', `Query is ${query} and parameters are ${parameters}`);
//             return rows;
//         } catch (err) {
//             loggers.ErrorLogger.log('error', err);
//             throw err;
//         } finally {
//             try {
//                 await databaseConnection.end();
//                 loggers.dataLogger.log('info', `Connection Closed`);
//             } catch (err) {
//                 loggers.ErrorLogger.log('error', `Error while closing connection ${err}`);
//             }
//         }
//     }
// }
// module.exports = Database;


// // Example usage with async/await
// (async () => {
//     try {
//         const result = await db.runQuery(`SELECT * FROM \`ParameterColln\` WHERE date = ?`, ["2024-01-06"]);
//         console.log(result);
//     } catch (error) {
//         console.error(error);
//     }
// })();

//server error where getting so added gpt code 
const mysql = require("mysql2/promise");
const loggers = require('../Backend/loggers/loggers');

class Database {
    constructor() { }

    async runQuery(query = "", parameters = []) {
        let databaseConnection;

        try {
            // Use a connection pool for better performance and management
            databaseConnection = await mysql.createPool({
                connectionLimit: 10, // Adjust based on your application's needs
                host: '103.195.185.168',
                user: 'indiscpx_BLVL',
                password: "indiscpx_BLVL@123",
                database: 'indiscpx_BLVL'
            }).getConnection();

            loggers.dataLogger.log('info', `Connection created`);

            const [rows, fields] = await databaseConnection.execute(query, parameters);
            loggers.dataLogger.log('info', `Query is ${query} and parameters are ${parameters}`);
            return rows;
        } catch (err) {
            loggers.ErrorLogger.log('error', err);
            throw err; // Rethrow the error for the calling code to handle
        } finally {
            try {
                if (databaseConnection) {
                    // Release the connection back to the pool
                    await databaseConnection.release();
                    loggers.dataLogger.log('info', `Connection Released`);
                }
            } catch (err) {
                loggers.ErrorLogger.log('error', `Error while releasing connection ${err}`);
            }
        }
    }
}

module.exports = Database;
