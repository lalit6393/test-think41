const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://securesight_rptr_user:FlNRwMg6GQp1liXZ6jhpWjJ9UfgXJMno@dpg-d21pihemcj7s73er7h6g-a.singapore-postgres.render.com/securesight_rptr',
    ssl: { rejectUnauthorized: false }
});

async function exportCsv() {
    const client = await pool.connect();
    const results = [];

    fs.createReadStream('products.csv') // Path to your CSV file
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            for (const row of results) {
                try {
                    await client.query(
                        'INSERT INTO products (id, cost, category, name, brand, retail_price, department, sku, distribution_center_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                        [row.id, row.cost, row.category, row.name, row.brand, row.retail_price, row.department, row.sku, row.distribution_center_id]
          );
} catch (err) {
    console.error('Insert failed for row:', row, err.message);
}
      }

client.release();
console.log('✅ Done exproting CSV to Postgres');
process.exit(0);
    });
}

exportCsv();
