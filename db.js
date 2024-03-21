/** Database for lunchly */
require("dotenv").config();
const pg = require("pg");
const dbLogin = process.env.DBLOGIN;
const db = new pg.Client(`postgresql://${dbLogin}/lunchly`);

db.connect();

module.exports = db;
