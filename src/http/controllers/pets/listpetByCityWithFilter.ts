import { makeListPetByCityUseCase } from '@/use-case/factories/make-list-pet-by-city-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listPetsByCityWithFilter(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listPetsParamsSchema = z.object({
    city: z.string().trim(),
    age: z.string().optional(),
    size: z.string().optional(),
    energy_level: z.string().optional(),
    environment: z.string().optional(),
  })

  const { city, age, size, energy_level, environment } =
    listPetsParamsSchema.parse(request.query)

  try {
    const listPetByCityUseCase = makeListPetByCityUseCase()

    const { pets } = await listPetByCityUseCase.execute({
      city,
      age,
      size,
      energy_level,
      environment,
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const formattedPets = pets.map(({ id, org_id, ...rest }) => rest)

    return reply.status(200).send(pets)
  } catch (err) {
    return reply.status(400).send({ message: 'Error listing pets' })
  }
}
