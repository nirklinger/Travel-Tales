import type { Knex } from 'knex';
import dotenv from 'dotenv';
// Update with your config settings.
dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    searchPath: 'travel_tales',
    connection: {
      port: 5432,
      host: '127.0.0.1',
      user: 'postgres',
      password: 'postgres',
      database: 'travel_tales',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: 'env/migrations',
      extension: 'ts',
      schemaName: 'public',
    },
    seeds: {
      directory: 'env/seeds',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      ssl: { rejectUnauthorized: false },
      port: Number(process.env.DB_PORT) || 5432,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

module.exports = config;
