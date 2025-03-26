import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

export const app = fastify()


app.register(cookie)

 // middleware qualquer router do server
 /*app.addHook('preHandler', async () => {
    console.log('welcome server...')
})*/

app.register(transactionsRoutes, {
    prefix: 'transactions'
})

