import { PetRepository } from '@/repositories/pet-repository'
import { Pet } from '@prisma/client'

interface listPetByCityUseCaseRequest {
  city: string
  age?: string
  size?: string
  energy_level?: string
  environment?: string
}

interface listPetByCityUseCaseResponse {
  pets: Pet[]
}

export class ListPetByCityUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute({
    city,
    age,
    size,
    energy_level,
    environment,
  }: listPetByCityUseCaseRequest): Promise<listPetByCityUseCaseResponse> {
    const pets = await this.petRepository.listAllByCitywithFilter(city, {
      age,
      size,
      energy_level,
      environment,
    })

    return { pets }
  }
}
