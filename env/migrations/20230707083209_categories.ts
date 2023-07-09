import { Knex } from 'knex';
import { SCHEMA_NAME } from '../../constants';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).createTable('categories', table => {
    table.increments().primary();
    table.string('name');
    table.text('description');
    table.integer('content_tokens');
  });
  await knex.schema
    .withSchema(SCHEMA_NAME)
    .raw('ALTER TABLE categories ADD COLUMN embedding vector(1536)');

  await knex.schema.withSchema(SCHEMA_NAME).raw(`
    create or replace function classify_categories (
      query_embedding vector(1536),
      match_threshold float,
      match_count int
      )
      returns table (
          id integer,
          name text,
          similarity float
      )
      language sql stable
      as $$
      select
      ${SCHEMA_NAME}.categories.id,
      ${SCHEMA_NAME}.categories.name,
      1 - ${SCHEMA_NAME}.cosine_distance(${SCHEMA_NAME}.categories.embedding,query_embedding) as similarity
      from ${SCHEMA_NAME}.categories
      where 1 - ${SCHEMA_NAME}.cosine_distance(${SCHEMA_NAME}.categories.embedding,query_embedding) > match_threshold
      order by similarity desc
      limit match_count;
    $$`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).dropTable('categories');
}
