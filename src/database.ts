import {knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: env.DATABASE_URL,
    },
    
    useNullAsDefault: true,

    migrations:{
        extension: 'ts',
        directory: './database/migration'
    }
}

export const knex = setupKnex(config)