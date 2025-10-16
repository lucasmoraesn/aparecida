import request from 'supertest';
import app from '../app.js';

describe('POST /api/create-subscription', () => {
  const originalFetch = global.fetch;

  beforeAll(() => {
    process.env.VITE_PUBLIC_URL_NGROK = 'https://example.ngrok.app';
    process.env.MP_ACCESS_TOKEN = 'TEST_TOKEN';
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('returns init_point and mp_subscription_id when MP responds', async () => {
    // mock MP preapproval response
    global.fetch = jest.fn(async (url, opts) => {
      return {
        ok: true,
        status: 201,
        json: async () => ({ id: 'sub_123', init_point: 'https://mp.example/checkout?pref_id=123', status: 'pending' })
      };
    });

    const resp = await request(app)
      .post('/api/create-subscription')
      .send({ planTitle: 'Teste', amount: 1 })
      .set('Accept', 'application/json');

    expect(resp.status).toBe(201);
    expect(resp.body).toHaveProperty('init_point');
    expect(resp.body).toHaveProperty('mp_subscription_id', 'sub_123');
  });
});
