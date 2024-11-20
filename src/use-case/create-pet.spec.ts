import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { CreatePetUseCase } from './create-pets'
import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository'
import { OrgNotFoundError } from './errors/org-not-found-error'

describe('Create Pet Use Case', async () => {
  let orgsRepository: InMemoryOrgsRepository
  let petRepository: InMemoryPetRepository
  let sut: CreatePetUseCase

  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petRepository = new InMemoryPetRepository()
    sut = new CreatePetUseCase(orgsRepository, petRepository)
  })

  it('should create a pet for an existing organization', async () => {
    // Criar uma organização no repositório de organizações
    const org = await orgsRepository.create({
      name: 'Test Org',
      author_name: 'Author-1',
      email: 'testorg@example.com',
      whatsapp: '+1234567890',
      password: 'hashedpassword',
      cep: '12345678',
      city: 'City-1',
      neighborhood: 'Neighborhood-1',
      street: 'Street-1',
      latitude: -22.0,
      longitude: -43.0,
    })

    // Criar um pet associado à organização existente
    const pet = await sut.execute({
      name: 'Buddy',
      about: 'Friendly and energetic dog',
      age: 'Young',
      size: 'Medium',
      energy_level: 'High',
      environment: 'Spacious yard',
      org_id: org.id,
    })

    // Verificar se o pet foi criado corretamente e associado à organização
    expect(pet.pet).toHaveProperty('id')
    expect(pet.pet.name).toBe('Buddy')
    expect(pet.pet.about).toBe('Friendly and energetic dog')
    expect(pet.pet.org_id).toBe(org.id)
  })

  it('should throw an error if the organization does not exist', async () => {
    // Tentar criar um pet com um `org_id` inexistente

    await expect(() =>
      sut.execute({
        name: 'Buddy',
        about: 'Friendly and energetic dog',
        age: 'Young',
        size: 'Medium',
        energy_level: 'High',
        environment: 'Spacious yard',
        org_id: 'nonexistent-org-id',
      }),
    ).rejects.toBeInstanceOf(OrgNotFoundError)
  })
})
