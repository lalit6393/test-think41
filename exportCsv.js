const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const absolutePath = path.resolve(__dirname, 'products.csv');
console.log('📄 Reading CSV from:', absolutePath);

(async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE TABLE products, departments RESTART IDENTITY CASCADE');

    const departmentsCache = {};

    const stream = fs.createReadStream(absolutePath).pipe(csv());

    for await (const row of stream) {
      const deptName = row.department.trim();

      // Check cache first
      let departmentId = departmentsCache[deptName];

      if (!departmentId) {
        // Try to find it in the DB
        const res = await client.query('SELECT id FROM departments WHERE name = $1', [deptName]);

        if (res.rows.length > 0) {
          departmentId = res.rows[0].id;
        } else {
          // 
          console.log('Insert new department', deptName);
          const insertRes = await client.query(
            'INSERT INTO departments (name) VALUES ($1) RETURNING id',
            [deptName]
          );
          departmentId = insertRes.rows[0].id;
        }

        // Cache it
        departmentsCache[deptName] = departmentId;
      }

      // Insert product row
      console.log('Insert product row');
      
      await client.query(
        `INSERT INTO products (id, cost, category, name, brand, retail_price, sku, distribution_center_id, department_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          row.id,
          row.cost,
          row.category,
          row.name,
          row.brand,
          row.retail_price,
          row.sku,
          row.distribution_center_id,
          departmentId,
        ]
      );
    }

    await client.query('COMMIT');
    console.log('✅ Data inserted successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error inserting data:', err);
  } finally {
    client.release();
  }
})();
