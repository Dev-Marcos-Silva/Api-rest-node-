import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { z } from "zod";

export async function transactionsRoutes(app: FastifyInstance) {

    app.get('/', async(request, replay) => {

        const transactions = await knex('transactions').select()

        return replay.send({transactions})
    })

    app.get('/:id', async(request, replay) => {

        const getTransactionParams = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParams.parse(request.params)

        const transaction = await knex('transactions').select().where({id}).first()

        return replay.send({transaction})
    })

    app.get('/summary', async(resquest, replay) => {

        const summary = await knex('transactions').sum('amount', { as: 'amount' }).first()

        return replay.send({summary})
    })

    app.post('/', async(request, replay) =>{

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit','debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(request.body)

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit'? amount : amount * -1
        })

        return replay.status(201).send()
    }) 
}