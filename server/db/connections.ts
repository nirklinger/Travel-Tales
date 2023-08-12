import knex from 'knex';

const connection = knex({
  client: 'pg',
  connection: {
    ssl: process.env.NODE_ENV === 'development' ? false : { rejectUnauthorized: false },
    port: Number(process.env.DB_PORT) || 5432,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'travel_tales',
  },
});

export function getConnection() {
  return connection;
}
