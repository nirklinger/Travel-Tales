import { ActivityEmbedding, CategoryEmbedding, FetchedCategory } from '../../types/types';
import { getConnection } from '../db/connections';
import { SCHEMA_NAME } from '../../constants';
import { Categories, Table } from '../../types/db-schema-definitions';

export const insertCategoryEmbedding = async (category: Categories, embedding: number[]) => {
  const connection = getConnection();
  await connection.schema.withSchema(SCHEMA_NAME).raw(
    `UPDATE ${Table.Categories} 
              SET content_tokens=${category.content_tokens}, embedding='[${embedding.join(',')}]'
              WHERE id=${category.id}
            `
  );
};

export const classifyCategories = async (
  searchEmbeddings: number[]
): Promise<CategoryEmbedding[]> => {
  const connection = getConnection();
  const categories = await connection.raw(
    `SELECT * FROM ${SCHEMA_NAME}.classify_categories('[${searchEmbeddings.join(',')}]', 0.8,3)`
  );
  return categories.rows;
};

export const getAllCategories = async () => {
  const connection = getConnection();
  const categories = await connection
    .select<Categories[]>(`${Table.Categories}.*`)
    .from(Table.Categories);
  return categories;
};

export const getClientCategories = async () => {
  const connection = getConnection();
  const categories = await connection
    .select<FetchedCategory[]>('id', 'name', 'description')
    .from(Table.Categories);
  return categories;
};

export const deleteActivityCategories = async (activityId: number) => {
  const connection = getConnection();
  await connection(Table.ActivityCategories).where('activity_id', activityId).delete();
};

export const insertActivityCategories = async (activity_id: number, categoryIds: number[]) => {
  const connection = getConnection();
  const pairs = categoryIds.map(category_id => ({ activity_id, category_id }));
  await connection.insert(pairs).into(Table.ActivityCategories);
};
