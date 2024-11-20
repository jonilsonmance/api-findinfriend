import { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { listPetsByCityWithFilter } from './listpetByCityWithFilter'
import { fetchDetailsPet } from './fetchDetailsPet'

export function petsRoutes(app: FastifyInstance) {
  app.get('/pets', listPetsByCityWithFilter)
  app.get('/pets/:petId', fetchDetailsPet)

  app.post('/pets', { preHandler: verifyJWT }, create)
}
