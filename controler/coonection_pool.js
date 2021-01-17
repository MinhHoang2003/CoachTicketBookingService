const util = require('util')

const mysql = require('mysql2')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '203.171.21.114',
    user: 'project',
    password: 'Trinhhoainam1998@',
    database: 'coachticketbookingdb',
    waitForConnections: true,
    queueLimit: 0
})

pool.getConnection((err, connection) => {
    if (err) {
        console.log('Something went wrong connecting to the databse :', err)
    }
    if (connection) {
        
        connection.release()
    };
    return;
})

pool.query = util.promisify(pool.query).bind(pool)

module.exports = pool