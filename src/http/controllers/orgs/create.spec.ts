import request from 'supertest'
import { app } from '@/app'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'

describe('Create Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready() // Garante que o servidor está pronto antes do teste
  })

  afterAll(async () => {
    await app.close() // Fecha o servidor após os testes
  })
  it('should be able to create', async () => {
    const response = await request(app.server).post('/orgs').send({
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

    expect(response.status).toBe(201)
  })

  it('should return 409 if organization already exists', async () => {
    // Simulando a situação onde a organização já existe
    // Primeira criação para garantir que a organização existe
    await request(app.server).post('/orgs').send({
      name: 'Test Org',
      author_name: 'Author-1',
      email: 'testorg@example.com',
      whatsapp: '+1234567890',
      password: 'password123',
      cep: '12345678',
      city: 'City-1',
      neighborhood: 'Neighborhood-1',
      street: 'Street-1',
      latitude: -22.0,
      longitude: -43.0,
    })

    // Tentativa de criar a mesma organização novamente
    const response = await request(app.server).post('/orgs').send({
      name: 'Test Org',
      author_name: 'Author-1',
      email: 'testorg@example.com',
      whatsapp: '+1234567890',
      password: 'password123',
      cep: '12345678',
      city: 'City-1',
      neighborhood: 'Neighborhood-1',
      street: 'Street-1',
      latitude: -22.0,
      longitude: -43.0,
    })

    expect(response.status).toBe(409)
  })
})
