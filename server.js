const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.database_url,
    ssl: { rejectUnauthorized: false }
});

const app = express();
app.use(morgan('dev'));

const corsOptions = {
    origin: 'http://localhost:4000', // Next.js dev server runs on port 3000 by default
    credentials: true,              // if you send cookies or auth headers
};

app.use(cors(corsOptions));

app.get('/api/products', async (req, res) => {

    const page = req.params.page || 0;
    const limit = 100;
    const offset = page * 100;
    try {
        const client = await pool.connect(); // connect inside the route or in app startup
        const data = await client.query(
            `SELECT 
    products.id AS id,
     products.cost AS cost,
     products.category AS category,
     products.brand AS brand,
     products.name AS name,
     products.retail_price AS retail_price,
     products.sku AS sku,
     products.distribution_center_id AS distribution_center_id,
     departments.name AS department
   FROM 
     products
   JOIN 
     departments ON products.department_id = departments.id
   LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        client.release(); // release connection back to the pool
        res.status(200).json(data.rows); // send data as JSON response
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).send('id not provided');

    try {
        const client = await pool.connect();

        const data = await client.query(
            `SELECT 
     products.id AS id,
     products.cost AS cost,
     products.category AS category,
     products.brand AS brand,
     products.name AS name,
     products.retail_price AS retail_price,
     products.sku AS sku,
     products.distribution_center_id AS distribution_center_id,
     departments.name AS department
   FROM 
     products
   JOIN 
     departments ON products.department_id = departments.id
   WHERE 
     products.id = $1`,
            [id]
        );
        client.release();
        res.status(200).json(data.rows);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/departments', async (req, res) => {
    try {
        const client = await pool.connect();

        const data = await client.query(`SELECT * FROM departments`);
        client.release();
        res.status(200).json(data.rows);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/departments/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).send('id not provided');

    try {
        const client = await pool.connect();

        const data = await client.query(`SELECT * FROM departments WHERE id = $1`, [id]);
        client.release();
        res.status(200).json(data.rows);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Server error');
    }
});

app.get('/api/departments/:id/products', async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).send('id not provided');

    try {
        const client = await pool.connect();

        const data = await client.query(
            `SELECT 
     products.id AS id,
     products.cost AS cost,
     products.category AS category,
     products.brand AS brand,
     products.name AS name,
     products.retail_price AS retail_price,
     products.sku AS sku,
     products.distribution_center_id AS distribution_center_id,
     departments.name AS department
   FROM 
     products
   JOIN 
     departments ON products.department_id = departments.id
   WHERE 
     departments.id = $1`,
            [id]
        );
        client.release();
        res.status(200).json(data.rows);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Server error');
    }
});

app.listen(3000, 'localhost', () => {
    console.log("server started");
})