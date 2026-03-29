import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "October12@",
    database : `blog`,
});

export default pool;