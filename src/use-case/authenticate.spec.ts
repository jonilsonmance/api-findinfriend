import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { describe, it, expect } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credential-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const sut = new AuthenticateUseCase(orgsRepository)

    // cria o usuario para testar a sessão

    await orgsRepository.create({
      name: 'Org-864',
      author_name: 'Author-41',
      email: 'org698@example.com',
      whatsapp: '+55601272751',
      password: await hash('password7076', 6),
      cep: '26154109',
      city: 'City-35',
      neighborhood: 'Neighborhood-8',
      street: 'Street-8',
      latitude: -82.21424033784433,
      longitude: -95.08584777423955,
    })

    const { org } = await sut.execute({
      email: 'org698@example.com',
      password: 'password7076',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const sut = new AuthenticateUseCase(orgsRepository)

    await expect(() =>
      sut.execute({
        email: 'org698@example.com',
        password: 'password7076',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const sut = new AuthenticateUseCase(orgsRepository)

    await orgsRepository.create({
      name: 'Org-864',
      author_name: 'Author-41',
      email: 'org698@example.com',
      whatsapp: '+55601272751',
      password: await hash('password7076', 6),
      cep: '26154109',
      city: 'City-35',
      neighborhood: 'Neighborhood-8',
      street: 'Street-8',
      latitude: -82.21424033784433,
      longitude: -95.08584777423955,
    })

    await expect(() =>
      sut.execute({
        email: 'org698@example.com',
        password: 'password', // teste com a senha incorreta
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
