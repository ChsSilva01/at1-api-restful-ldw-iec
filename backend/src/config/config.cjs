require('dotenv').config();

const isSSL = process.env.DB_SSL === 'true';

const base = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dialect: 'postgres',
  dialectOptions: isSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {}
};

// O sequelize-cli escolhe a chave pelo NODE_ENV (no Render: production)
module.exports = {
  development: base,
  test: base,
  production: base
};
