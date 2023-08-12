import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { updateTaleCoverPhoto } from '../../../../server/services/tales';

const updateCoverPhoto = async (req: NextApiRequest, res: NextApiResponse) => {
    const bodyTaleToUpdate = req.body.taleId;
    const bodyCoverPhoto = req.body.coverPhoto;
    const newPath = await updateTaleCoverPhoto(bodyTaleToUpdate, bodyCoverPhoto);

    res.status(StatusCodes.OK).send({url: newPath});
};


export default createApiHandler().put<NextApiRequest, NextApiResponse>(updateCoverPhoto);
