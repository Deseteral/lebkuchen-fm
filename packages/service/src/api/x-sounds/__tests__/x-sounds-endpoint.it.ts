import request from 'supertest';
import main from '@service/main';

describe('/x-sounds endpoint integration test', () => {
  it('should fetch x-sounds list', async () => {
    const app = await main({ startServer: false });
    const response = await request(app).get('/');

    console.log(response);

    expect(response.status).toBe(200);
    expect(response.get('Content-Type')).toBe('application/json');
  });
});
