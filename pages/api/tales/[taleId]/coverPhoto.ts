import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { updateTaleCoverPhoto } from '../../../../server/services/tales';

const updateCoverPhoto = async (req: NextApiRequest, res: NextApiResponse) => {
    const bodyTaleToUpdate = req.body.taleId;
    const bodyCoverPhoto = req.body.coverPhoto;
    await updateTaleCoverPhoto(bodyTaleToUpdate, bodyCoverPhoto);
  
    res.status(StatusCodes.OK);
};


export default createApiHandler().put<NextApiRequest, NextApiResponse>(updateCoverPhoto);
