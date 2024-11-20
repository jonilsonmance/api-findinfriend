import { PetNotFoundError } from '@/use-case/errors/pet-not-found-error'
import { makeFetchDetailsUseCase } from '@/use-case/factories/make-fetch-details-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchDetailsPet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchDetailsPetParamsSchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = fetchDetailsPetParamsSchema.parse(request.params)

  try {
    const fetchDetailsPetUseCase = makeFetchDetailsUseCase()

    const { pet } = await fetchDetailsPetUseCase.execute({ petId })

    return reply.status(200).send(pet)
  } catch (err) {
    if (err instanceof PetNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(400).send({ message: 'Error retrieving pet details' })
  }
}
