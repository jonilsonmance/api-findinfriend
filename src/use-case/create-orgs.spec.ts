import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { expect, describe, it } from 'vitest'
import { CreateOrgsUseCase } from './create-orgs'
import { compare } from 'bcryptjs'
import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

describe('Create Use Case Orgs', () => {
  it('should be able to create', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const sut = new CreateOrgsUseCase(orgsRepository)

    const { org } = await sut.execute({
      name: 'Org-864',
      author_name: 'Author-41',
      email: 'org698@example.com',
      whatsapp: '+55601272751',
      password: 'password7076',
      cep: '26154109',
      city: 'City-35',
      neighborhood: 'Neighborhood-8',
      street: 'Street-8',
      latitude: -82.21424033784433,
      longitude: -95.08584777423955,
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash user password upon create', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const sut = new CreateOrgsUseCase(orgsRepository)

    const { org } = await sut.execute({
      name: 'Org-864',
      author_name: 'Author-41',
      email: 'org698@example.com',
      whatsapp: '+55601272751',
      password: 'password7076',
      cep: '26154109',
      city: 'City-35',
      neighborhood: 'Neighborhood-8',
      street: 'Street-8',
      latitude: -82.21424033784433,
      longitude: -95.08584777423955,
    })

    const isPasswordCorrecryHashed = await compare('password7076', org.password)

    expect(isPasswordCorrecryHashed).toBe(true)
  })

  it('should not be able to create with same email twice', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const sut = new CreateOrgsUseCase(orgsRepository)

    const email = 'org698@example.com'

    await sut.execute({
      name: 'Org-864',
      author_name: 'Author-41',
      email,
      whatsapp: '+55601272751',
      password: 'password7076',
      cep: '26154109',
      city: 'City-35',
      neighborhood: 'Neighborhood-8',
      street: 'Street-8',
      latitude: -82.21424033784433,
      longitude: -95.08584777423955,
    })

    await expect(() =>
      sut.execute({
        name: 'Org-864',
        author_name: 'Author-41',
        email,
        whatsapp: '+55601272751',
        password: 'password7076',
        cep: '26154109',
        city: 'City-35',
        neighborhood: 'Neighborhood-8',
        street: 'Street-8',
        latitude: -82.21424033784433,
        longitude: -95.08584777423955,
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
