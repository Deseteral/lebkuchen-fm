/* eslint-disable prefer-arrow-callback */
import express from 'express';
import SongsService from '../../domain/songs/songs-service';

const router = express.Router();

router.get('/', async function getSongs(_, res) {
  const songs = await SongsService.instance.getAll();
  res.send({ songs });
});

export default router;
