import { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreateOrgsUseCase } from '@/use-case/factories/make-create-orgs-use-case'
import { z } from 'zod'
import { OrgAlreadyExistsError } from '@/use-case/errors/org-already-exists-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string().min(3),
    author_name: z.string().min(3).trim(),
    email: z.string().email(),
    whatsapp: z.string(),
    password: z.string().min(6),
    cep: z.string(),
    city: z.string().min(2).trim(),
    neighborhood: z.string().min(2).trim(),
    street: z.string().min(3).trim(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const {
    name,
    author_name,
    email,
    whatsapp,
    password,
    cep,
    city,
    neighborhood,
    street,
    latitude,
    longitude,
  } = createBodySchema.parse(request.body)

  try {
    const createOrgUseCase = makeCreateOrgsUseCase()

    await createOrgUseCase.execute({
      name,
      author_name,
      email,
      whatsapp,
      password,
      cep,
      city,
      neighborhood,
      street,
      latitude,
      longitude,
    })
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}
