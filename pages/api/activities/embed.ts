import { createApiHandler } from '../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchAllActivitiesToEmbed, updateActivityById } from '../../../server/dal/activities';
import { embedActivities } from '../../../server/services/embedding';
import {
  classifyCategories,
  deleteActivityCategories,
  insertActivityCategories,
} from '../../../server/dal/categories';
import activityId from './[activityId]';
import { logger } from '../../../utils/server-logger';

async function embed(req: NextApiRequest, res: NextApiResponse) {
  const activities = await fetchAllActivitiesToEmbed();

  for (let activity of activities) {
    try {
      const allEmbeddings = await embedActivities({
        id: activity.id,
        description: activity.name + ', ' + activity.description,
      });

      await updateActivityById(activity.id, { should_embed: false });

      const categories = await Promise.all(
        allEmbeddings.map(embedding => classifyCategories(embedding))
      );
      const categoryIds = categories.flat().map(cat => cat.id);

      await deleteActivityCategories(activity.id);
      await insertActivityCategories(activity.id, categoryIds);
    } catch (err) {
      logger.error({ err }, 'failed embedding activity');
    }
  }

  res.status(200).send('OK');
}

export default createApiHandler().post<NextApiRequest, NextApiResponse>(embed);
