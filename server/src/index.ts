import 'reflect-metadata'

import { COOKIE_NAME, __prod__ } from './constants'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import { MyContext } from './entities/types'
import session from 'express-session'
import connectRedis from 'connect-redis'
import Redis from 'ioredis'
import { DataSource } from 'typeorm'
import { Post } from './entities/Post'
import { User } from './entities/User'

export const dataSource = async () => {
  const myDataSource = new DataSource({
    type: 'postgres',
    database: 'lireddit',
    username: 'postgres',
    password: 'govindajaya',
    logging: true,
    synchronize: true,
    entities: [Post, User]
  })
  await myDataSource.initialize()
  return myDataSource
}

const main = async () => {
  await dataSource()
  const RedisStore = connectRedis(session)
  const redis = new Redis()

  const app = express()

  /**
   * Problem of Cookie not shown/stored in the browser Apollo
   * @see https://community.apollographql.com/t/cookie-not-shown-stored-in-the-browser/1901/3
   */
  app.set('trust proxy', !__prod__)

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax', // csrf if lax
        secure: false // cookie only works in https if true
      },
      saveUninitialized: false, // create a session by default with no data
      secret: 'qwertypoiuy',
      resave: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis
    })
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true
    }
  })

  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}

main().catch((err) => {
  console.log(err)
})
