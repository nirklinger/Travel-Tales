
import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { getUserByExternalIdService } from '../../../../server/services/users';

async function validateUserProfileByExternalId(req: NextApiRequest, res: NextApiResponse) {
    const externalUserId = req.query.userId as string;
    const validatedUser = await getUserByExternalIdService(externalUserId);

    res.status(StatusCodes.OK).send(validatedUser);
}

export default createApiHandler().get<NextApiRequest, NextApiResponse>(validateUserProfileByExternalId);