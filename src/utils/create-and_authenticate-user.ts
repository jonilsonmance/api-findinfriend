import request from 'supertest'
import { FastifyInstance } from 'fastify'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/orgs').send({
    name: 'Org Test',
    author_name: 'John Doe',
    email: 'test@example.com',
    whatsapp: '1234567890',
    password: 'securepassword',
    cep: '12345-678',
    city: 'Test City',
    neighborhood: 'Test Neighborhood',
    street: 'Test Street',
    latitude: 45.0,
    longitude: 90.0,
  })
  const authResponse = await request(app.server).post('/sessions').send({
    email: 'test@example.com',
    password: 'securepassword',
  })

  const { token } = authResponse.body

  return { token }
}
