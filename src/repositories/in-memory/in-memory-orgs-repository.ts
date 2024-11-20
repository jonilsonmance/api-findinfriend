import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { Decimal } from '@prisma/client/runtime/library'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findById(id: string) {
    const org = this.items.find((org) => org.id === id)
    return org || null
  }

  async findbyEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const latitude = new Decimal(data.latitude as string)
    const longitude = new Decimal(data.longitude as string)

    const org = {
      id: 'org-01',
      name: data.name,
      author_name: data.author_name,
      email: data.email,
      whatsapp: data.whatsapp,
      password: data.password,
      cep: data.cep,
      city: data.city,
      neighborhood: data.neighborhood,
      street: data.street,
      latitude,
      longitude,
    }
    this.items.push(org)

    return org
  }
}
