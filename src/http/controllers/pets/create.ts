import { InvalidCredentialsError } from '@/use-case/errors/invalid-credential-error'
import { makeCreatePetUseCase } from '@/use-case/factories/make-create-pets-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const petBodySchema = z.object({
    name: z.string().trim().min(3),
    about: z.string().trim(),
    age: z.string(),
    size: z.string(),
    energy_level: z.string(),
    environment: z.string(),
  })

  const org_id = request.user?.sub

  if (!org_id) {
    return reply.status(400).send({ message: 'Org ID not found' })
  }

  const { name, about, age, size, energy_level, environment } =
    petBodySchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  try {
    await createPetUseCase.execute({
      name,
      about,
      age,
      size,
      energy_level,
      environment,
      org_id,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}
