const { Pool } = require('pg');
const fs = require('fs');
const copyFrom = require('pg-copy-streams').from;

const pool = new Pool({
  connectionString: 'postgresql://securesight_rptr_user:FlNRwMg6GQp1liXZ6jhpWjJ9UfgXJMno@dpg-d21pihemcj7s73er7h6g-a.singapore-postgres.render.com/securesight_rptr',
  ssl: { rejectUnauthorized: false }
});

(async () => {
  const client = await pool.connect();
  await client.query('TRUNCATE TABLE products');
  const stream = client.query(copyFrom('COPY products (id, cost, category, name, brand, retail_price, department, sku, distribution_center_id) FROM STDIN WITH CSV HEADER'));
  const fileStream = fs.createReadStream('products.csv');

  fileStream.on('error', err => console.error('File error:', err));
  stream.on('error', err => console.error('Stream error:', err));
  stream.on('end', () => {
    console.log('✅ Done with COPY');
    client.release();
    process.exit(0);
  });

  fileStream.pipe(stream);
})();

