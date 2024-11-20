import { OrgsRepository } from '@/repositories/orgs-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { GetOrgProfileUseCase } from './get-org-profiles'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { ResourceNotInvalidError } from './errors/resource-not-found-error'

describe('Get Org Profile Use Case', () => {
  let orgRepository: OrgsRepository
  let sut: GetOrgProfileUseCase

  beforeEach(() => {
    orgRepository = new InMemoryOrgsRepository()
    sut = new GetOrgProfileUseCase(orgRepository)
  })

  it('should retrieve the a organization profile if org exists', async () => {
    // Cria uma organização no repositório
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

    // Executa o caso de uso para buscar o perfil da organização
    const { org: orgProfile } = await sut.execute({
      orgId: org.id,
    })

    // Verifica se o perfil da organização foi retornado corretamente
    expect(orgProfile).toHaveProperty('id', org.id)
    expect(orgProfile.name).toBe('Test Org')
    expect(orgProfile.email).toBe('testorg@example.com')
  })

  it('should throw an error if the organizations does not exist', async () => {
    // Tenta buscar uma organização inexistente
    await expect(() =>
      sut.execute({ orgId: 'nonexistent-org-id' }),
    ).rejects.toBeInstanceOf(ResourceNotInvalidError)
  })
})
