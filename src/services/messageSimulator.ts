const DEFAULT_URL='/commands';

function sendMessage(url: string, message: string) {
  return fetch(url || DEFAULT_URL, {
    body: JSON.stringify(generateBody(message)),
    method: 'POST',
  });
}

function generateBody(message: string): object {
  return {
    event: 'room_message',
    item: {
        message: {
            date: (new Date()).toISOString(),
            from: {
                id: 123,
                mention_name: 'WitrynaBot',
                name: 'Witryna testowa',
            },
            id: 'testId_' + Date.now().toString(),
            mentions: [],
            message,
            type: 'message',
        },
        room: {
            id: 1234,
            name: 'LebkuchenFM'
        },
    },
    webhook_id: 123456,
  };
}

export default {
  sendMessage,
};
