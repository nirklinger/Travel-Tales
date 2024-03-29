import { Knex } from 'knex';
import { SCHEMA_NAME } from '../../constants';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).createTable('trip_destinations', table => {
    table.increments().primary();
    table.integer('trip_id').notNullable();
    table.integer('first_day');
    table.integer('last_day');
    table.string('name').notNullable();
    table.integer('sequential_number').notNullable();
    table.json('geo_location');
    table
      .foreign('trip_id')
      .references('trip_id')
      .inTable('travel_tales.trips')
      .withKeyName('fk_trip_id')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).dropTable('trip_destinations');
}
