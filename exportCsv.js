const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const copyFrom = require('pg-copy-streams').from;

const pool = new Pool({
  connectionString: process.env.database_url,
  ssl: { rejectUnauthorized: false }
});

(async () => {
    const absolutePath = path.resolve(__dirname, 'products.csv');
  const client = await pool.connect();
  await client.query('TRUNCATE TABLE products');
  const stream = client.query(copyFrom('COPY products (id, cost, category, name, brand, retail_price, department, sku, distribution_center_id) FROM STDIN WITH CSV HEADER'));
  const fileStream = fs.createReadStream(absolutePath);

  fileStream.on('error', err => console.error('File error:', err));
  stream.on('error', err => console.error('Stream error:', err));
  stream.on('end', () => {
    console.log('✅ Done with COPY');
    client.release();
    process.exit(0);
  });

  fileStream.pipe(stream);
})();

