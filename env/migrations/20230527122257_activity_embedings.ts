import { Knex } from 'knex';
import { SCHEMA_NAME } from '../../constants';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).createTable('activity_embeddings', table => {
    table.increments().primary();
    table.integer('activity_id').notNullable();
    table.text('content');
    table.integer('content_tokens');
    table
      .foreign('activity_id')
      .references('id')
      .inTable('travel_tales.activities')
      .withKeyName('fk_activities_id')
      .onDelete('CASCADE');
  });
  await knex.schema.withSchema(SCHEMA_NAME).raw('CREATE EXTENSION vector');
  await knex.schema
    .withSchema(SCHEMA_NAME)
    .raw('ALTER TABLE activity_embeddings ADD COLUMN embedding vector(1536)');

  await knex.schema.withSchema(SCHEMA_NAME).raw(`
    create or replace function match_activities (
      query_embedding vector(1536),
      match_threshold float,
      match_count int
      )
      returns table (
          id integer,
          activity_id integer,
          content text,
          similarity float
      )
      language sql stable
      as $$
      select
      activity_embeddings.id,
      activity_embeddings.activity_id,
      activity_embeddings.content,
      1 - (activity_embeddings.embedding <=> query_embedding) as similarity
      from activity_embeddings
      where 1 - (activity_embeddings.embedding <=> query_embedding) > match_threshold
      order by similarity desc
      limit match_count;
    $$`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(SCHEMA_NAME).dropTable('activities');
}
