import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";


// tipos de test //
// Unitários: Unidade da sua aplícação
// Integração: comunicação entre duas ou mais unidades
// e2e - ponta a ponta: Simulam um usuário operando a nossa aplicação

// front-end: navegação e inserir os dados nas paginas
// back-end: chamadas HTTP, WebSockets

// Pirãmide de testes: E2E 

export async function transactionsRoutes(app: FastifyInstance) {

    // middleware para a routar transactions
    /*app.addHook('preHandler', async () => {
        console.log('router transactions...')
    })*/

    app.get('/', { preHandler: [ checkSessionIdExists ] }, async(request, reply) => {

        const { sessionId } = request.cookies
        
        const transactions = await knex('transactions').where('session_id', sessionId).select()

        return reply.send({transactions})
    })

    app.get('/:id', { preHandler: [ checkSessionIdExists ] },  async(request, reply) => {

        const { sessionId } = request.cookies

        const getTransactionParams = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParams.parse(request.params)

        const transaction = await knex('transactions').select().where({session_id: sessionId, id}).first()

        return reply.send({transaction})
    })

    app.get('/summary', { preHandler: [ checkSessionIdExists ] },  async(request, reply) => {

        const { sessionId } = request.cookies

        const summary = await knex('transactions').where({session_id: sessionId}).sum('amount', { as: 'amount' }).first()

        return reply.send({summary})
    })

    app.post('/', async(request, reply) =>{


        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit','debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if(!sessionId){

            sessionId = randomUUID()

            reply.setCookie('sessionId', sessionId,{
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 day
            }) 

        }

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit'? amount : amount * -1,
            session_id: sessionId
        })

        return reply.status(201).send()
    }) 
}