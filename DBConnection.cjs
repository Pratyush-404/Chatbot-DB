const { readFileSync } = require('fs');
const { Pool } = require('pg');
require('dotenv').config();

const certPath = process.env.SSL_CERT_PATH;

if (!certPath) {
  throw new Error('SSL_CERT_PATH environment variable is not set');
}

const cert = readFileSync(certPath, 'utf-8');

const pool = new Pool({
  user: 'postgres',
  host: 'bf-1.chmgskcy8kco.us-east-1.rds.amazonaws.com',
  database: 'main',
  password: 'BeFluentAWS$2025',
  port: 5432,
  ssl: {
    rejectUnauthorized: true,
    ca: cert
  }
});

async function checkConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to the AWS database successfully!');
    client.release();
  } catch (err) {
    console.error('Error connecting to the AWS database:', err);
  }
}

checkConnection();