import { PetFilters } from '@/@types/pet-filters'
import { PetRepository } from '../pet-repository'
import { Pet, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export class PrismaPetRepository implements PetRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })
    return pet
  }

  async listAllByCitywithFilter(
    city: string,
    filters: PetFilters = {},
  ): Promise<Pet[]> {
    const { age, size, energy_level, environment } = filters
    const pets = await prisma.pet.findMany({
      where: {
        org: { city: { contains: city, mode: 'insensitive' } },
        ...(age && { age: { contains: age, mode: 'insensitive' } }),
        ...(size && { size: { contains: size, mode: 'insensitive' } }),
        ...(energy_level && {
          energy_level: { contains: energy_level, mode: 'insensitive' },
        }),
        ...(environment && {
          environment: { contains: environment, mode: 'insensitive' },
        }),
      },
    })
    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({ data })
    return pet
  }
}
