const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.database_url,
    ssl: { rejectUnauthorized: false } // Required for most hosted DBs
});

client.connect()
    .then(() => client.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY,
      cost NUMERIC,
      category TEXT,
      name TEXT,
      brand TEXT,
      retail_price NUMERIC,
      department TEXT,
      sku TEXT UNIQUE,
      distribution_center_id INT
    );
  `))
    .then(() => {
        console.log('✅ PL/pgSQL executed');
        client.end();
    })
    .catch(err => console.error('❌ Error running PL/pgSQL:', err));
