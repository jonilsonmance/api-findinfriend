import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { CreateOrgsUseCase } from '../create-orgs'

export function makeCreateOrgsUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const useCase = new CreateOrgsUseCase(orgsRepository)

  return useCase
}
