/* eslint-disable prefer-arrow-callback */
import express from 'express';
import XSoundsService from './x-sounds-service';

const router = express.Router();

router.get('/', async function getXSounds(_, res) {
  const sounds = await XSoundsService.instance.getAll();
  res.send({ sounds });
});

export default router;
