/* eslint-disable prefer-arrow-callback */
import express from 'express';
import multer from 'multer';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import XSoundsService from '../../domain/x-sounds/x-sounds-service';
import Logger from '../../infrastructure/logger';
import ErrorResponse from '../error-response';

const router = express.Router();
const logger = new Logger('x-sound-upload-controller');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async function getXSounds(_, res) {
  const sounds = await XSoundsService.instance.getAll();
  res.send({ sounds });
});

router.post('/', upload.single('soundFile'), async function addXSound(req, res) {
  if (!req.file || !req.body.soundName) {
    res.status(StatusCodes.BAD_REQUEST);
    const response: ErrorResponse = {
      description: ReasonPhrases.BAD_REQUEST,
      error: { message: 'Missing required field' },
    };
    res.send(response);
    return;
  }

  const { buffer, originalname } = req.file;
  const { soundName } = req.body;

  logger.info(`Uploading x-sound ${soundName}`);

  try {
    const xSound = await XSoundsService.instance.createNewSound(soundName, { buffer, fileName: originalname });
    res.send(xSound);
  } catch (e) {
    const errorMessage = (e as Error).message;
    logger.error(`An error occured ${errorMessage}`);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    const response: ErrorResponse = {
      description: ReasonPhrases.INTERNAL_SERVER_ERROR,
      error: { message: errorMessage },
    };
    res.send(response);
  }
});

// TODO: To be removed after migration
router.post('/migration', async function xSoundsMigration(_, res) {
  try {
    await XSoundsService.instance.migration();
    res.status(StatusCodes.OK);
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
  res.send();
});

export default router;
