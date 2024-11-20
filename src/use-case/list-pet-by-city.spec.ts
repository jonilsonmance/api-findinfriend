import { describe, expect, it, beforeEach } from 'vitest'
import { ListPetByCityUseCase } from './list-pet-by-city-use-case'
import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository'

describe('List Pet By City Use Case', () => {
  let petRepository: InMemoryPetRepository
  let sut: ListPetByCityUseCase

  beforeEach(() => {
    petRepository = new InMemoryPetRepository()
    sut = new ListPetByCityUseCase(petRepository)
  })

  it('should list pets in a specific city without filters', async () => {
    // Adiciona uma org à cidade
    await petRepository.createOrg({
      id: 'org-01',
      city: 'City-1',
    })

    // Adiciona pets vinculados à org
    await petRepository.create({
      name: 'Buddy',
      about: 'Friendly dog',
      age: 'Young',
      size: 'Medium',
      energy_level: 'High',
      environment: 'Spacious yard',
      org_id: 'org-01',
    })
    await petRepository.create({
      name: 'Milo',
      about: 'Playful dog',
      age: 'Adult',
      size: 'Large',
      energy_level: 'Medium',
      environment: 'Indoors',
      org_id: 'org-01',
    })

    const { pets } = await sut.execute({
      city: 'City-1',
    })

    expect(pets).toHaveLength(2)
    expect(pets[0].name).toBe('Buddy')
    expect(pets[1].name).toBe('Milo')
  })

  it('should return an empty list if no pets watch the city', async () => {
    await petRepository.createOrg({
      id: 'org-02',
      city: 'City-2',
    })

    const { pets } = await sut.execute({
      city: 'City-1',
    })

    expect(pets).toHaveLength(0)
  })
})
