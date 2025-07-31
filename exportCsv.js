const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const copyFrom = require('pg-copy-streams').from;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Use only for hosted DBs like Heroku
});

(async () => {
  const absolutePath = path.resolve(__dirname, 'products.csv');
  console.log('📄 Using CSV at:', absolutePath);

  const client = await pool.connect();

  try {
    await client.query('TRUNCATE TABLE products');

    const stream = client.query(copyFrom(`
      COPY products (id, cost, category, name, brand, retail_price, department, sku, distribution_center_id)
      FROM STDIN WITH CSV HEADER
    `));
    
    const fileStream = fs.createReadStream(absolutePath);

    fileStream.on('error', err => {
      console.error('❌ File error:', err);
      client.release();
    });

    stream.on('error', err => {
      console.error('❌ Stream error:', err);
      client.release();
    });

    stream.on('finish', () => {
      console.log('✅ Done with COPY');
      client.release();
    });

    fileStream.pipe(stream);
  } catch (err) {
    console.error('❌ Query error:', err);
    client.release();
  }
})();
