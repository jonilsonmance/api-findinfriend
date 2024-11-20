import request from 'supertest'
import { app } from '@/app'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('List Pets By City With Filter Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return a list of pets filtered by city', async () => {
    // Criação de uma organização para associar aos pets
    const org = await prisma.org.create({
      data: {
        id: 'org-123',
        name: 'Animal Shelter',
        author_name: 'John Doe',
        email: 'contact@animalshelter.com',
        whatsapp: '1234567890',
        password: 'securepassword',
        cep: '12345-678',
        city: 'Test City',
        neighborhood: 'Test Neighborhood',
        street: 'Test Street',
        latitude: 45.0,
        longitude: 90.0,
      },
    })

    // Criação de pets no banco de dados associados à organização
    const pet1 = await prisma.pet.create({
      data: {
        name: 'Buddy',
        age: '2',
        size: 'medium',
        about: 'A friendly dog',
        org_id: org.id,
        energy_level: 'high',
        environment: 'indoors',
      },
    })

    // Fazendo a requisição para listar pets com filtros
    const response = await request(app.server)
      .get('/pets')
      .query({ city: 'Test City', energy_level: 'high' }) // Filtros aplicados
      .send()

    // Verifica se a resposta HTTP está correta
    expect(response.statusCode).toBe(200)

    // Valida os pets retornados (apenas os que correspondem ao filtro)
    expect(response.body).toEqual([
      {
        id: pet1.id,
        name: 'Buddy',
        age: '2',
        size: 'medium',
        about: 'A friendly dog',
        org_id: org.id,
        energy_level: 'high',
        environment: 'indoors',
      },
    ])
  })
})
