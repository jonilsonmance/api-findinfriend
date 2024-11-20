import { Pet, Prisma } from '@prisma/client'
import { PetFilters } from '@/@types/pet-filters'

export interface PetRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  listAllByCitywithFilter(city: string, filters?: PetFilters): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
}
