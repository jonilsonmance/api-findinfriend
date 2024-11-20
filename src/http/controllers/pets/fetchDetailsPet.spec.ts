import request from 'supertest'
import { app } from '@/app'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Fetch Pet Details Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return pet details successfully', async () => {
    // Criação de uma organização necessária para a chave estrangeira
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

    // Criação de um pet no banco de dados associado à organização
    const pet = await prisma.pet.create({
      data: {
        name: 'Buddy',
        age: '2',
        size: 'medium',
        about: 'A friendly dog',
        org_id: org.id, // Associar ao ID da organização criada
        energy_level: 'high',
        environment: 'indoors',
      },
    })

    // Fazendo a requisição para obter os detalhes do pet
    const response = await request(app.server).get(`/pets/${pet.id}`).send()

    // Verifica se a resposta HTTP está correta
    expect(response.statusCode).toBe(200)

    // Valida o conteúdo retornado
    expect(response.body).toEqual({
      id: pet.id,
      name: 'Buddy',
      age: '2',
      size: 'medium',
      about: 'A friendly dog',
      energy_level: 'high',
      environment: 'indoors',
      org_id: org.id,
      whatsapp: org.whatsapp,
    })
  })
})
