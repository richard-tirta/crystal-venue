var express = require('express');
const doteenv = require('dotenv');

doteenv.config();

// const pool = process.env.DATABASE_URL
//     ? new Pool({
//         connectionString: process.env.DATABASE_URL,
//         ssl: {
//             rejectUnauthorized: false
//         }
//     })
//     : new Pool({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_DATABASE,
//         password: process.env.DB_PASSWORD,
//         port: process.env.DB_PORT,
//     });
//    postgres://process.env.DB_USER:process.env.DB_PASSWORD@process.env.DB_HOST:process.env.DB_PORT/process.env.DB_DATABASE

const {
    postgraphile
} = require("postgraphile");

var app = express();
app.use(
    postgraphile(
        'postgres://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD +'@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_DATABASE,
        "public", {
            watchPg: true,
            graphiql: true,
            enhanceGraphiql: true,
        }
    )
);
app.listen(4000, () => console.log('go to for playground graphiql http://localhost:4000/graphiql'))