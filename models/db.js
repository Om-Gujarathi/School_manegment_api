require("dotenv").config(); // Load environment variables from .env file
const { Client } = require("pg");


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});


client
  .connect()
  .then(() => {
    console.log("Connected to the PostgreSQL database.");

    // Example query
    return client.query("SELECT NOW()");
  })
  .then((res) => {
    console.log("Current time:", res.rows[0]);
  })
  .catch((err) => {
    console.error("Connection error", err.stack);
  })
  .finally(() => {
    // Close the connection
    client.end();
  });
