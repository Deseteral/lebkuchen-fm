/* eslint-disable prefer-arrow-callback */
import express from 'express';
import SongService from './song-service';

const router = express.Router();

router.get('/', async function getSongs(_, res) {
  const songs = await SongService.instance.getAll();
  res.send({ songs });
});

export default router;
