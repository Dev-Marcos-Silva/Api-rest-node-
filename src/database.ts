import 'dotenv/config'
import {knex as setupKnex, Knex } from 'knex'

if(!process.env.DATABASE_URL){
    throw new Error('DATABASE_URL NOT FOUND')
}

export const config: Knex.Config = {
    client: 'sqlite',
    connection: {
        filename: process.env.DATABASE_URL,
    },
    
    useNullAsDefault: true,

    migrations:{
        extension: 'ts',
        directory: './database/migration'
    }
}

export const knex = setupKnex(config)