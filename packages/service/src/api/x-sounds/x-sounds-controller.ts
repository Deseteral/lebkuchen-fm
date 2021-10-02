/* eslint-disable prefer-arrow-callback */
import express from 'express';
import multer from 'multer';
import XSoundsService from '../../domain/x-sounds/x-sounds-service';
import Logger from '../../infrastructure/logger';

const router = express.Router();
const logger = new Logger('x-sound-upload-controller');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async function getXSounds(_, res) {
  const sounds = await XSoundsService.instance.getAll();
  res.send({ sounds });
});

router.post('/', upload.single('soundFile'), async function addXSound(req, res) {
  if (!req.file) {
    res.status(400);
    res.send();
    return;
  }

  const { buffer, originalname } = req.file;
  const { soundName } = req.body;

  logger.info(`Uploading x-sound ${soundName}`);

  const xSound = await XSoundsService.instance.createNewSound(soundName, { buffer, fileName: originalname });
  res.send(xSound);
});

export default router;
