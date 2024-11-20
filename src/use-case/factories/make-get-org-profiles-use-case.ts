import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { GetOrgProfileUseCase } from '../get-org-profiles'

export function makeGetOrgProfilesUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const useCase = new GetOrgProfileUseCase(orgsRepository)

  return useCase
}
