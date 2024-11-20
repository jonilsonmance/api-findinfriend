import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet-repository'
import { ListPetByCityUseCase } from '../list-pet-by-city-use-case'

export function makeListPetByCityUseCase() {
  const petRepository = new PrismaPetRepository()
  const useCase = new ListPetByCityUseCase(petRepository)

  return useCase
}
