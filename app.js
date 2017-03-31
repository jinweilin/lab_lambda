'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');


// declare a new express app
const app = express();
app.use(bodyParser.json());

var config = {
  user:  process.env.DB_USER , //env var: PGUSER
  database: process.env.DB_NAME , //env var: PGDATABASE
  password: process.env.DB_PWD, //env var: PGPASSWORD
  host: process.env.DB_HOST , // Server hosting the postgres database
  port: process.env.DB_PORT ? process.env.DB_PORT : 5432, //env var: PGPORT
  max: process.env.DB_MAX ? process.env.DB_MAX : 10, // max number of clients in the pool
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT ? process.env.DB_IDLE_TIMEOUT : 30000, // how long a client is allowed to remain idle before being closed
};

const pool = new pg.Pool(config);
pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
});

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/orders', function(req, res) {
  pool.connect(function(err, client, done) {
    if(err) {
      res.status(500).json({
        code: "100",
        message: "DB ERROR"
      });
    }
    client.query('SELECT $1::int AS number ', ['1'], function(err, result) {
      //call `done(err)` to release the client back to the pool (or destroy it if there is an error) 
      done(err);
      if(err) {
        return console.error('error running query', err);
        res.status(500).json({
          code: "101",
          message: "Query ERROR"
        });
      }
      res.status(200).json( {
        code:"000" ,
        result: result.rows[0] 
      });
    });
  });
});

// if (!process.env.ORDERS_TABLE) {
  let server = app.listen(function() {
    let host = server.address().address;
    if (host == "::") {
      host = "localhost";
    }
    let port = server.address().port;
    console.log("Example app listening at http://%s:%s/orders", host, port);
  })
// }

module.exports = app;