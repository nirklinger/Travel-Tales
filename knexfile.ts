import type { Knex } from 'knex';

// Update with your config settings.

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
      ssl: { rejectUnauthorized: false },
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
      database: 'my_db',
      user: 'username',
      password: 'password',
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
