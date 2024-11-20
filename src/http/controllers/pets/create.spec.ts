import request from 'supertest'
import { app } from '@/app'
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/create-and_authenticate-user'

vi.mock('@/use-case/factories/make-create-pets-use-case')

describe('Create Pet Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a pet successfully', async () => {
    // Obtém o token do utilitário
    const { token } = await createAndAuthenticateUser(app)

    // Simula a requisição para criar um pet
    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        about: 'A friendly dog',
        age: '2',
        size: 'medium',
        energy_level: 'high',
        environment: 'indoors',
      })

    expect(response.statusCode).toBe(201)
  })
})
