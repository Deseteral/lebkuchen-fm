import { Signale } from 'signale';

let signale: Signale<'sockets'>;

function initialize() {
  const options = {
    types: {
      sockets: {
        badge: '🌍',
        color: 'blue',
        label: 'sockets',
        logLevel: 'info',
      },
    },
  };
  signale = new Signale(options);
  signale.config({
    displayTimestamp: true,
    displayFilename: true,
  });
}

function get() {
  return signale;
}

export {
  initialize,
  get,
};
