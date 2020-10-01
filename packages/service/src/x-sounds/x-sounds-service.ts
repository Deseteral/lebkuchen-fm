import XSoundsRepository from './x-sounds-repository';
import XSound from './x-sound';

function getAll(): Promise<XSound[]> {
  return XSoundsRepository.findAll();
}

export {
  getAll,
};
