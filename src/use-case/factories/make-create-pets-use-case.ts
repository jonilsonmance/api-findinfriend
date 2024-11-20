import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet-repository'
import { CreatePetUseCase } from '../create-pets'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

export function makeCreatePetUseCase() {
  const petRepository = new PrismaPetRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const useCase = new CreatePetUseCase(orgsRepository, petRepository)

  return useCase
}
