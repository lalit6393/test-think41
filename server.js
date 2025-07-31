const express = require('express');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.database_url,
    ssl: { rejectUnauthorized: false }
});

const app = express();
app.use(morgan('dev'));

app.get('/api/products', async (req, res) => {
    try {
        const client = await pool.connect(); // connect inside the route or in app startup
        const data = await client.query('SELECT * FROM products');
        client.release(); // release connection back to the pool
        res.json(data.rows); // send data as JSON response
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
            'SELECT * FROM products WHERE id = $1',
            [id] // safely parameterized
        );

        client.release();
        res.json(data.rows);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Server error');
    }
});

app.listen(3000, 'localhost', () => {
    console.log("server started");
})