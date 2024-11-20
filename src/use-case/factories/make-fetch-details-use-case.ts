import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet-repository'
import { FetchDetailsPetUseCase } from '../fetch-details-pet'

export function makeFetchDetailsUseCase() {
  const petRepository = new PrismaPetRepository()
  const orgRepository = new PrismaOrgsRepository()

  const useCase = new FetchDetailsPetUseCase(petRepository, orgRepository)

  return useCase
}
