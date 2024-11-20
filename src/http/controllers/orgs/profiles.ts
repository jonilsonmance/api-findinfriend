import { makeGetOrgProfilesUseCase } from '@/use-case/factories/make-get-org-profiles-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getOrgProfile = makeGetOrgProfilesUseCase()

  const { org } = await getOrgProfile.execute({
    orgId: request.user.sub,
  })

  return reply.status(200).send({
    org: {
      ...org,
      password: undefined,
    },
  })
}
