import { PetFilters } from '@/@types/pet-filters'
import { Prisma, Pet } from '@prisma/client'
import { PetRepository } from '../pet-repository'

// Definimos uma interface para simular as organizações (Orgs)
interface Org {
  id: string
  city: string
}

export class InMemoryPetRepository implements PetRepository {
  public items: Pet[] = []
  public orgs: Org[] = []

  // Método para criar uma organização (Org)
  async createOrg(data: Org) {
    this.orgs.push(data)
  }

  // Método para criar um pet
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: `pet-${Date.now()}`,
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      environment: data.environment,
      org_id: data.org_id,
    }
    this.items.push(pet)

    return pet
  }

  // Método para listar pets por cidade e filtros
  async listAllByCitywithFilter(city: string, filters?: PetFilters) {
    // Filtrar organizações pela cidade
    const filteredOrgs = this.orgs.filter(
      (org) => org.city.toLowerCase() === city.toLowerCase(),
    )
    const orgIds = filteredOrgs.map((org) => org.id)

    return this.items.filter((pet) => {
      const matchesCity = orgIds.includes(pet.org_id)
      const matchesAge = filters?.age ? pet.age === filters.age : true
      const matchesSize = filters?.size ? pet.size === filters.size : true
      const matchesEnergyLevel = filters?.energy_level
        ? pet.energy_level === filters.energy_level
        : true
      const matchesEnvironment = filters?.environment
        ? pet.environment === filters.environment
        : true

      return (
        matchesCity &&
        matchesAge &&
        matchesSize &&
        matchesEnergyLevel &&
        matchesEnvironment
      )
    })
  }

  // Método para buscar um pet pelo ID
  async findById(id: string) {
    const pet = this.items.find((pet) => pet.id === id)

    return pet || null
  }
}
