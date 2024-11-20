import request from 'supertest'
import { app } from '@/app'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { InvalidCredentialsError } from '@/use-case/errors/invalid-credential-error'

describe('Authenticate Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate in the application', async () => {
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

    const response = await request(app.server).post('/sessions').send({
      email: 'test@example.com',
      password: 'securepassword',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).to.have.property('token').that.is.a('string')
  })

  it('should not be able to authenticate with invalid credentials', async () => {
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

    const response = await request(app.server).post('/sessions').send({
      email: 'test01@example.com',
      password: 'securepassword0101',
    })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual({
      message: new InvalidCredentialsError().message,
    })
  })
})
