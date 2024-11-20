import { Org } from '@prisma/client'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { InvalidCredentialsError } from './errors/invalid-credential-error'
import bcrypt from 'bcryptjs'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  org: Org
}

export class AuthenticateUseCase {
  constructor(private orgsRepository: OrgsRepository) {}
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const org = await this.orgsRepository.findbyEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatched = await bcrypt.compare(password, org.password)

    if (!doesPasswordMatched) {
      throw new InvalidCredentialsError()
    }

    return { org }
  }
}
