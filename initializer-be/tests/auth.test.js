const request = require('supertest');
const { app } = require('../src/index');
const sequelize = require('../src/config/database');
const User = require('../src/models/User');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({
    username: 'testuser',
    password: 'testpassword'
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  let token;

  it('should login successfully with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'testpassword'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'wrongpassword'
    });
    expect(res.statusCode).toBe(401);
  });

  it('should return user info with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('testuser');
  });

  it('should fail /me with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer invalid-token`);
    expect(res.statusCode).toBe(401);
  });
});
