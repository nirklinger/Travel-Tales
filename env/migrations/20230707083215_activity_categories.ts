import { Knex } from 'knex';
import { SCHEMA_NAME } from '../../constants';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).createTable('activity_categories', table => {
    table.increments().primary();
    table.integer('activity_id').notNullable();
    table.integer('category_id').notNullable();
    table
      .foreign('activity_id')
      .references('id')
      .inTable('travel_tales.activities')
      .withKeyName('fk_activities_id')
      .onDelete('CASCADE');
    table
      .foreign('category_id')
      .references('id')
      .inTable('travel_tales.categories')
      .withKeyName('fk_categories_id')
      .onDelete('CASCADE');
    table.unique(['activity_id', 'category_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).dropTable('activity_categories');
}
