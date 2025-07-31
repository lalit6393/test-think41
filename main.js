const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.database_url,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    await client.connect();

    await client.query('DROP TABLE IF EXISTS products');
    await client.query('DROP TABLE IF EXISTS departments');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE
      );
    `);

    await client.query(`
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
    `);

    // Alter table
    await client.query(`ALTER TABLE products DROP COLUMN IF EXISTS department;`);
    await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS department_id INT;`);

    // Add foreign key constraint
    await client.query(`
      ALTER TABLE products
      ADD CONSTRAINT fk_department
      FOREIGN KEY (department_id)
      REFERENCES departments(id);
    `);

    console.log('✅ Database setup completed.');
  } catch (err) {
    console.error('❌ Error during DB setup:', err);
  } finally {
    await client.end();
  }
}

setupDatabase();
