import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { updateTaleCoverPhoto } from '../../../../server/services/tales';

const updateCoverPhoto = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(`tales/[taleId]/coverPhoto api - update tale cover photo`);
    const bodyTaleToUpdate = req.body.taleToUpdate;
    //console.log(`tales/[taleId]/coverPhoto api - bodyTaleToUpdate: ${JSON.stringify(bodyTaleToUpdate)}`);
    const bodyCoverPhoto = req.body.coverPhoto;
    //console.log(`tales/[taleId]/coverPhoto api - bodyCoverPhoto: ${bodyCoverPhoto.path}`);
    await updateTaleCoverPhoto(bodyTaleToUpdate, bodyCoverPhoto);
  
    res.status(StatusCodes.OK);
};


export default createApiHandler().put<NextApiRequest, NextApiResponse>(updateCoverPhoto);
