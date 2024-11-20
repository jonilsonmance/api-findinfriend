import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetRepository } from '@/repositories/pet-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchDetailsPetUseCase } from './fetch-details-pet'
import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { PetNotFoundError } from './errors/pet-not-found-error'
import { OrgNotFoundError } from './errors/org-not-found-error'

describe('Fetch Details Pet Use Case', () => {
  let petRepository: PetRepository
  let orgRepository: OrgsRepository
  let sut: FetchDetailsPetUseCase

  beforeEach(() => {
    petRepository = new InMemoryPetRepository()
    orgRepository = new InMemoryOrgsRepository()
    sut = new FetchDetailsPetUseCase(petRepository, orgRepository)
  })

  it('should fetch pet details and org whatsapp for an existing pet ', async () => {
    // Cria uma organização no repositório de organizações
    const org = await orgRepository.create({
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
    // Cria um pet associado à organização no repositório de pets
    const pet = await petRepository.create({
      name: 'Buddy',
      about: 'Friendly dog',
      age: 'Young',
      size: 'Medium',
      energy_level: 'High',
      environment: 'Spacious yard',
      org_id: org.id,
    })
    // Executa o caso de uso para buscar os detalhes do pet
    const { pet: petDetails } = await sut.execute({
      petId: pet.id,
    })

    // Verifica se os detalhes do pet e o WhatsApp da organização estão corretos
    expect(petDetails).toHaveProperty('id', pet.id)
    expect(petDetails.name).toBe('Buddy')
    expect(petDetails.about).toBe('Friendly dog')
    expect(petDetails.whatsapp).toBe('+1234567890')
  })

  it('should throw an error if the pet does not exist', async () => {
    // Tenta buscar detalhes de um pet inexistente
    await expect(() =>
      sut.execute({ petId: 'nonexistent-pet-id' }),
    ).rejects.toBeInstanceOf(PetNotFoundError)
  })

  it('should throw an error if the org associated with the pet does not exist', async () => {
    // Cria um pet com um org_id inexistente
    const pet = await petRepository.create({
      name: 'Buddy',
      about: 'Friendly dog',
      age: 'Young',
      size: 'Medium',
      energy_level: 'High',
      environment: 'Spacious yard',
      org_id: 'nonexistent-org-id',
    })

    // Tenta buscar detalhes do pet, que está associado a uma organização inexistente

    await expect(() => sut.execute({ petId: pet.id })).rejects.toBeInstanceOf(
      OrgNotFoundError,
    )
  })
})
