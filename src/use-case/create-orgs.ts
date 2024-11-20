import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { OrgAlreadyExistsError } from './errors/org-already-exists-error'

interface createOrgsUseCaseRequest {
  name: string
  author_name: string
  email: string
  whatsapp: string
  password: string
  cep: string
  city: string
  neighborhood: string
  street: string
  latitude: number
  longitude: number
}

interface createOrgsUseCaseResponse {
  org: Org
}

export class CreateOrgsUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    author_name,
    email,
    whatsapp,
    password,
    cep,
    city,
    neighborhood,
    street,
    latitude,
    longitude,
  }: createOrgsUseCaseRequest): Promise<createOrgsUseCaseResponse> {
    const password_hash = await bcrypt.hash(password, 6)

    const orgWithSameEmail = await this.orgsRepository.findbyEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      name,
      author_name,
      email,
      whatsapp,
      password: password_hash,
      cep,
      city,
      neighborhood,
      street,
      latitude,
      longitude,
    })
    return { org }
  }
}
