/* eslint-disable prefer-arrow-callback */
import express from 'express';
import * as XSoundsService from './x-sounds-service';

const router = express.Router();

router.get('/', async function getXSounds(_, res) {
  const sounds = await XSoundsService.getAll();
  res.send({ sounds });
});

export default router;
