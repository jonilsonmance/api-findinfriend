import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetRepository } from '@/repositories/pet-repository'
import { Pet } from '@prisma/client'
import { PetNotFoundError } from './errors/pet-not-found-error'
import { OrgNotFoundError } from './errors/org-not-found-error'

interface fetchDetailsPetUseCaseRequest {
  petId: string
}

interface fetchDetailsPetUseCaseResponse {
  pet: Omit<Pet, 'org_id'> & { whatsapp: string }
}

export class FetchDetailsPetUseCase {
  constructor(
    private petRepository: PetRepository,
    private orgRepository: OrgsRepository,
  ) {}

  async execute({
    petId,
  }: fetchDetailsPetUseCaseRequest): Promise<fetchDetailsPetUseCaseResponse> {
    const pet = await this.petRepository.findById(petId)

    if (!pet) {
      throw new PetNotFoundError()
    }

    const org = await this.orgRepository.findById(pet.org_id)

    if (!org) {
      throw new OrgNotFoundError()
    }

    return {
      pet: {
        ...pet,
        whatsapp: org.whatsapp,
      },
    }
  }
}
